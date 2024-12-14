import moment from 'moment';
export const formatDate = (date: Date) => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

export const getRelativeDate = (targetDate: string | Date) => {
  const now = moment();
  const target = moment(targetDate);

  const diffDays = target.diff(now, 'days');

  if (diffDays === 0) {
    return 'hôm nay';
  } else if (diffDays > 0) {
    return `còn ${diffDays} ngày`;
  } else {
    return 'đã trễ';
  }
};
