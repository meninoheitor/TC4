export const getMonthName = (dateStr: Date) => {
  const date = new Date(dateStr);

  const month = date.toLocaleString("pt-BR", { month: "long" });

  return month.charAt(0).toUpperCase() + month.slice(1);
}