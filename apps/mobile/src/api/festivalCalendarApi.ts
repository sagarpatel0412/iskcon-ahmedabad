import {api} from '../api/client'

export async function getFestivalCalendar(params: {
  year: number;
  city?: string;
  country?: string;
}) {
  const query = new URLSearchParams();

  query.append("year", String(params.year));

  if (params.city) query.append("city", params.city);
  if (params.country) query.append("country", params.country);

  const res = await api.get(`/festival-calendar?${query.toString()}`);
  const data = res.data;

//   if (!res.ok) {
//     throw new Error(data.message || "Failed to fetch festival calendar");
//   }

  return data.data || [];
}