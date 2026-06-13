import argparse
import io
import json
import sys
from datetime import date

import gaurabda as gcal


IMPORTANT_KEYWORDS = [
    "Nityananda",
    "Gaura",
    "Gauranga",
    "Caitanya",
    "Chaitanya",
    "Rama Navami",
    "Ram Navami",
    "Janmastami",
    "Janmashtami",
    "Radhastami",
    "Radhashtami",
    "Govardhana",
    "Nrsimha",
    "Narasimha",
    "Balarama",
    "Advaita",
    "Appearance",
    "Disappearance",
    "Ekadasi",
    "Ekadashi",
]


def parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument("--year", type=int, required=True)
    parser.add_argument("--city", type=str, default="Ahmedabad")
    parser.add_argument("--country", type=str, default="India")
    parser.add_argument("--days", type=int, default=370)
    return parser.parse_args()


def find_location(city: str, country: str):
    try:
        location = gcal.FindLocation(city=city)
        if location:
            return location
    except Exception:
        pass

    # Fallback Ahmedabad
    return gcal.GCLocation(
        data={
            "latitude": 23.0225,
            "longitude": 72.5714,
            "tzname": "+5:30 Asia/Calcutta",
            "name": f"{city}, {country}",
        }
    )


def generate_raw_calendar(year: int, city: str, country: str, days: int):
    location = find_location(city, country)

    start_date = gcal.GCGregorianDate(
        year=year,
        month=1,
        day=1,
    )

    calendar = gcal.TCalendar()
    calendar.CalculateCalendar(location, start_date, days)

    stream = io.StringIO()
    calendar.write(stream, format="json")

    raw = stream.getvalue()
    return json.loads(raw)


def collect_text(value):
    texts = []

    if isinstance(value, str):
        texts.append(value)

    elif isinstance(value, list):
        for item in value:
            texts.extend(collect_text(item))

    elif isinstance(value, dict):
        for item in value.values():
            texts.extend(collect_text(item))

    return texts


def extract_date(item):
    # Try common JSON structures from calendar output.
    possible_keys = ["date", "gregorian", "day"]

    for key in possible_keys:
        value = item.get(key)

        if isinstance(value, str):
            return value[:10]

        if isinstance(value, dict):
            y = value.get("year")
            m = value.get("month")
            d = value.get("day")

            if y and m and d:
                return f"{int(y):04d}-{int(m):02d}-{int(d):02d}"

    # fallback: scan nested values
    texts = collect_text(item)
    for text in texts:
        if len(text) >= 10 and text[4:5] == "-" and text[7:8] == "-":
            return text[:10]

    return None


def is_important_event(text):
    lowered = text.lower()
    return any(keyword.lower() in lowered for keyword in IMPORTANT_KEYWORDS)


def convert_to_fullcalendar(raw_calendar, year, city, country):
    events = []

    if isinstance(raw_calendar, dict):
        possible_days = (
            raw_calendar.get("days")
            or raw_calendar.get("calendar")
            or raw_calendar.get("data")
            or []
        )
    elif isinstance(raw_calendar, list):
        possible_days = raw_calendar
    else:
        possible_days = []

    for index, day_item in enumerate(possible_days):
        if not isinstance(day_item, dict):
            continue

        event_date = extract_date(day_item)
        if not event_date or not event_date.startswith(str(year)):
            continue

        texts = collect_text(day_item)

        for text in texts:
            clean = " ".join(text.split())

            if not clean:
                continue

            if not is_important_event(clean):
                continue

            events.append(
                {
                    "id": f"{event_date}-{len(events) + 1}",
                    "title": clean,
                    "start": event_date,
                    "allDay": True,
                    "extendedProps": {
                        "city": city,
                        "country": country,
                        "source": "gaurabda",
                    },
                }
            )

    # Remove duplicates
    unique = {}
    for event in events:
        key = f"{event['start']}::{event['title']}"
        unique[key] = event

    return list(unique.values())


def main():
    args = parse_args()

    try:
        raw_calendar = generate_raw_calendar(
            args.year,
            args.city,
            args.country,
            args.days,
        )

        events = convert_to_fullcalendar(
            raw_calendar,
            args.year,
            args.city,
            args.country,
        )

        print(json.dumps(events, ensure_ascii=False))

    except Exception as error:
        print(
            json.dumps(
                {
                    "success": False,
                    "error": str(error),
                }
            ),
            file=sys.stderr,
        )
        sys.exit(1)


if __name__ == "__main__":
    main()