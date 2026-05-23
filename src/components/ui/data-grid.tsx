"use client"

import * as React from "react"
import { SearchIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

type PrimitiveValue = string | number | boolean | null | undefined
export type DataGridCellValue = PrimitiveValue | React.ReactNode

export interface DataGridColumn {
  key: string
  title: string
  className?: string
}

export interface DataGridRow {
  id: string | number
  [key: string]: DataGridCellValue
}

type DataGridProps = {
  columns: DataGridColumn[]
  rows: DataGridRow[]
  pageSize?: number
  searchableColumns?: string[]
  searchPlaceholder?: string
  emptyText?: string
  className?: string
}

function toSearchableText(value: DataGridCellValue): string {
  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return String(value)
  }

  return ""
}

function DataGrid({
  columns,
  rows,
  pageSize = 5,
  searchableColumns = [],
  searchPlaceholder = "ابحث داخل الجدول",
  emptyText = "لا توجد بيانات للعرض",
  className,
}: DataGridProps) {
  const [query, setQuery] = React.useState("")
  const [currentPage, setCurrentPage] = React.useState(1)

  const searchableKeys = React.useMemo(
    () =>
      searchableColumns.length > 0
        ? searchableColumns
        : columns.map((column) => column.key),
    [columns, searchableColumns]
  )

  const filteredRows = React.useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    if (!normalizedQuery) {
      return rows
    }

    return rows.filter((row) =>
      searchableKeys.some((key) =>
        toSearchableText(row[key]).toLowerCase().includes(normalizedQuery)
      )
    )
  }, [rows, searchableKeys, query])

  React.useEffect(() => {
    setCurrentPage(1)
  }, [query, rows.length])

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize))
  const pageStart = (currentPage - 1) * pageSize
  const currentRows = filteredRows.slice(pageStart, pageStart + pageSize)

  return (
    <div className={cn("data-grid-wrapper", className)}>
      <div className="data-grid-toolbar">
        <div className="relative w-full max-w-sm">
          <SearchIcon className="pointer-events-none absolute inset-s-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="ps-9"
            placeholder={searchPlaceholder}
          />
        </div>
        <p className="text-xs text-muted-foreground sm:text-sm">
          إجمالي النتائج: {filteredRows.length}
        </p>
      </div>

      <div className="data-grid-scroll">
        <table className="data-grid-table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={cn("data-grid-header-cell", column.className)}
                >
                  {column.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentRows.length > 0 ? (
              currentRows.map((row) => (
                <tr key={row.id} className="data-grid-row">
                  {columns.map((column) => {
                    const value = row[column.key]

                    return (
                      <td
                        key={`${row.id}-${column.key}`}
                        className={cn("data-grid-cell", column.className)}
                      >
                        {React.isValidElement(value)
                          ? value
                          : toSearchableText(value) || "-"}
                      </td>
                    )
                  })}
                </tr>
              ))
            ) : (
              <tr>
                <td className="data-grid-empty" colSpan={columns.length}>
                  {emptyText}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="data-grid-footer">
        <p className="text-xs text-muted-foreground sm:text-sm">
          صفحة {currentPage} من {totalPages}
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
          >
            السابق
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() =>
              setCurrentPage((page) => Math.min(totalPages, page + 1))
            }
          >
            التالي
          </Button>
        </div>
      </div>
    </div>
  )
}

export { DataGrid }
