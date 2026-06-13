import EventFormBase from "./EventFormBase";
import { createEvent } from "../../services/eventService";

export default function CreateEventPage() {
  return <EventFormBase mode="create" onSubmit={createEvent} />;
}
