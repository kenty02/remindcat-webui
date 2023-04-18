// import { Stack } from "@mantine/core";
// placeholder
const Stack = ({ children }: { children: React.ReactNode }) => {
  return <div>{children}</div>;
};
import { useReadRemindersMeRemindersMeGet } from "../api/default/default";
import { ReminderRead } from "../api/model";

export default (): JSX.Element => {
  const remindersQuery = useReadRemindersMeRemindersMeGet(undefined, { query: { suspense: true } });

  return (
    <Stack>
      {remindersQuery.data!.map((reminder) => {
        return <ReminderItem key={reminder.id} reminder={reminder} />;
      })}
    </Stack>
  );
};

const ReminderItem = ({ reminder }: { reminder: ReminderRead }) => {
  const time = new Date(reminder.time);
  const timeString = time.toLocaleString();
  return (
    <div key={reminder.id}>
      <p>
        {reminder.name}@{timeString}
      </p>
    </div>
  );
};
