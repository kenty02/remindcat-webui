import { ActionIcon, Flex, Stack, Text } from "@mantine/core";
import {
  getReadRemindersMeRemindersMeGetQueryKey,
  useReadRemindersMeRemindersMeDelete,
  useReadRemindersMeRemindersMeGet,
} from "../api/default/default";
import { ReminderRead } from "../api/model";
import { Trash } from "tabler-icons-react";
import { queryClient } from "../main";

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
  const { mutate: deleteMutate } = useReadRemindersMeRemindersMeDelete({
    mutation: {
      onMutate: () => {
        const queryKey = getReadRemindersMeRemindersMeGetQueryKey();
        const previousValue = queryClient.getQueryData(queryKey);
        queryClient.setQueryData<ReminderRead[]>(queryKey, (old) => {
          return old?.filter((reminder) => reminder.id !== reminder.id);
        });
        return { previousValue };
      },
      onSettled: () => {
        const queryKey = getReadRemindersMeRemindersMeGetQueryKey();
        queryClient.invalidateQueries(queryKey);
      },
    },
  });

  const handleDelete = () => {
    deleteMutate({ params: { id: reminder.id } });
  };
  return (
    <div key={reminder.id}>
      <Flex>
        <Text size={"md"}>
          {reminder.name}@{timeString}
        </Text>
        {/*delete button*/}
        <ActionIcon onClick={handleDelete}>
          <Trash />
        </ActionIcon>
      </Flex>
    </div>
  );
};
