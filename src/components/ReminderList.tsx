import { Stack } from "@mantine/core";
import { useReadRemindersMeRemindersMeGet } from "@/api/default/default";
import { ReminderRead } from "@/api/model";

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
  return (
    <div key={reminder.id}>
      <p>{reminder.name}</p>
    </div>
  );
};
