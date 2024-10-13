export function safeParseFloat(value: number | undefined | string): number {
  if (value === undefined) return 0;

  let parsedValue: number;

  if (typeof value === "string") {
    try {
      // get rid of currency symbols and string chars if they are there
      const sanitizedValue = value.replace(/[^0-9.-]+/g, "");
      parsedValue = parseFloat(sanitizedValue);
    } catch (e) {
      return 0;
    }
  } else if (typeof value === "number") {
    parsedValue = value;
  } else {
    return 0;
  }

  if (isNaN(parsedValue) || !isFinite(parsedValue)) {
    return 0;
  }

  const formattedValue = parsedValue.toFixed(2);

  return parseFloat(formattedValue);
}
