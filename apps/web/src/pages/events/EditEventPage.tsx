import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import EventFormBase from "./EventFormBase";
import { getEvent, updateEvent } from "../../services/eventService";
import AppLoader from "../../components/common/AppLoader";

export default function EditEventPage() {
  const { uuid } = useParams();
  const [event, setEvent] = useState<any>(null);

  useEffect(() => {
    getEvent(uuid!).then((res) => setEvent(res.data));
  }, [uuid]);

  if (!event) {
    return (
      <AppLoader
        title="Loading events"
        subtitle="Fetching spiritual wisdom..."
      />
    );
  }

  return (
    <EventFormBase
      mode="edit"
      initialEvent={event}
      onSubmit={(payload) => updateEvent(uuid!, payload)}
    />
  );
}
