const numberFormatter = new Intl.NumberFormat("az-AZ");

const moneyFormatter = new Intl.NumberFormat("az-AZ", {
  style: "currency",
  currency: "AZN",
  maximumFractionDigits: 2,
});

const dateFormatter = new Intl.DateTimeFormat("az-AZ", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

export const formatNumber = (value?: number) =>
  value === undefined ? "-" : numberFormatter.format(value);

export const formatMoney = (value?: string) => {
  if (!value) return "-";

  const parsedValue = Number(value);
  return Number.isFinite(parsedValue)
    ? moneyFormatter.format(parsedValue)
    : value;
};

export const formatDate = (value?: string) => {
  if (!value) return "-";

  const parsedValue = new Date(value);
  return Number.isNaN(parsedValue.getTime())
    ? value
    : dateFormatter.format(parsedValue);
};
