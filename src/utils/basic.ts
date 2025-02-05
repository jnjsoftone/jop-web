// & Functions AREA
// &---------------------------------------------------------------------------

// * Data / Time
/**
 * Get Today Date (yyyy-MM-dd)
 * @returns {string} Returns today date string.
 * @example
 *
 * today()
 * => 2023-07-15
 */
const today = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/**
 * Convert date string to ko-KR(yyyy년 M월 d일 (요일))
 * @param {string} dateStr The function to delay.
 * @example
 *
 * dateKo('2023-07-15')
 * => 2023년 7월 15일 (토)
 */
const dateKo = (dateStr: string) =>
  new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    weekday: "short",
  }).format(new Date(dateStr));

/**
 * Sleep For Second
 * @param sec
 */
const sleep = (sec: number) => {
  let start = Date.now(),
    now = start;
  while (now - start < sec * 1000) {
    now = Date.now();
  }
};

// & Export AREA
// &---------------------------------------------------------------------------
export { today, dateKo, sleep };
