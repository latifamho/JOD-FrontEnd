type ApiParamsRecord = Record<string, unknown>;

function isPlainRecord(value: unknown): value is ApiParamsRecord {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }

  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function compactValue(value: unknown): unknown {
  if (value === undefined || value === null || value === "") return undefined;

  if (Array.isArray(value)) {
    const items = value
      .map(compactValue)
      .filter((item) => item !== undefined);
    return items.length > 0 ? items : undefined;
  }

  if (isPlainRecord(value)) {
    const record = Object.entries(value).reduce<ApiParamsRecord>(
      (result, [key, nestedValue]) => {
        const compacted = compactValue(nestedValue);
        if (compacted !== undefined) result[key] = compacted;
        return result;
      },
      {},
    );

    return Object.keys(record).length > 0 ? record : undefined;
  }

  return value;
}

/**
 * Builds API query params while preserving nested objects such as
 * `filter: { status: "active" }`, which Axios serializes as
 * `filter[status]=active` for the Laravel query builder contract.
 */
export function buildApiParams<TParams extends object>(
  params: TParams,
): ApiParamsRecord {
  return (compactValue(params) as ApiParamsRecord | undefined) ?? {};
}
