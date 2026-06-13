import { useEffect, useState } from "react";
import EventFormBaseScreen from "./EventFormBaseScreen";
import { getEventByUuid, updateEvent } from "../../api/eventApi";

export default function EditEventScreen({ navigation, route }: any) {
  const { eventUuid } = route.params;

  const [event, setEvent] = useState<any>(null);
  const [loadingPage, setLoadingPage] = useState(true);

  useEffect(() => {
    fetchEvent();
  }, [eventUuid]);

  const fetchEvent = async () => {
    try {
      setLoadingPage(true);

      const res = await getEventByUuid(eventUuid);
      const eventData = res.data?.event || res.data;

      setEvent(eventData);
    } finally {
      setLoadingPage(false);
    }
  };

  return (
    <EventFormBaseScreen
      mode="edit"
      navigation={navigation}
      initialEvent={event}
      loadingPage={loadingPage}
      onSubmit={(payload) => updateEvent(eventUuid, payload)}
    />
  );
}