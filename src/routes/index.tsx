import { component$} from '@builder.io/qwik';
// import styles from './chatbot.module.css';
import { ChatBot } from '~/components/chatbot/chatbot';
import { Navbar } from '~/components/Navbar/Navbar';

export default component$(() => {
  return (
    <div >
      <Navbar />
      <ChatBot />
    </div>
  );
});
