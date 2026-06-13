import EventFormBaseScreen from "./EventFormBaseScreen";
import { createEvent } from "../../api/eventApi";

export default function CreateEventScreen({ navigation }: any) {
  return (
    <EventFormBaseScreen
      mode="create"
      navigation={navigation}
      onSubmit={createEvent}
    />
  );
}