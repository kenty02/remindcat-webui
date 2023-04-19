import ReminderList from "./components/ReminderList";
import { Container, Text } from "@mantine/core";

function App() {
  return (
    <div className="App">
      <Container size={"sm"}>
        <Text size="xl">リマインダー一覧</Text>
        <ReminderList />
      </Container>
    </div>
  );
}

export default App;
