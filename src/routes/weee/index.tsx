import { component$ } from '@builder.io/qwik';
import type { DocumentHead } from "@builder.io/qwik-city";


const TestPage = component$(() => {
    return (
        <div>
            <h1>Test Page</h1>
            <p>This is a test page.</p>
            <p>Hi there</p>
        </div>
    );
});

export const head: DocumentHead = {
    title: "Test Page",
    meta: [
        {
            name: "description",
            content: "Test page description",
        },
    ],
};

export default TestPage;