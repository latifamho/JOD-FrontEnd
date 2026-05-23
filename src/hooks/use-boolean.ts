import { useState, useCallback } from 'react';

function useBoolean(initialValue: boolean) {
	const [value, setValue] = useState(initialValue);

	const onTrue = useCallback(() => setValue(true), []);
	const onFalse = useCallback(() => setValue(false), []);
	const onToggle = useCallback(() => setValue((prevValue) => !prevValue), []);

	return { value, onTrue, onFalse, onToggle };
}

export type UseBoolean = ReturnType<typeof useBoolean>;

export default useBoolean;
