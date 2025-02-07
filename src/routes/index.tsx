import { component$} from '@builder.io/qwik';
// import styles from './chatbot.module.css';
import { ChatBot } from '~/components/chatbot/chatbot';

export default component$(() => {
  return (
    <div >
      <ChatBot />
    </div>
  );
});
