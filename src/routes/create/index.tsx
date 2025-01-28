import { component$ } from "@builder.io/qwik";
import { routeAction$, zod$, z, Form } from "@builder.io/qwik-city";
import { PrismaClient } from "@prisma/client";

export const useCreateUser = routeAction$(
  async (data, { status }) => {
    const prisma = new PrismaClient();
    try {
      const user = await prisma.user.create({
        data,
      });
      return user;
    } catch (error) {
      console.error("Error creating user:", error);
      status(500);
      return { error: "Failed to create user" };
    } finally {
      await prisma.$disconnect();
    }
  },
  zod$({
    name: z.string(),
    email: z.string().email(),
  }),
);

export default component$(() => {
  const createUserAction = useCreateUser();
  return (
    <section>
      <h1>Create User</h1>
      <Form action={createUserAction}>
        <label>
          Name
          <input name="name" value={createUserAction.formData?.get("name")} />
        </label>
        <label>
          Email
          <input name="email" value={createUserAction.formData?.get("email")} />
        </label>
        <button type="submit">Create</button>
      </Form>
      {createUserAction.value && !createUserAction.value.error && (
        <div>
          <h2>User created successfully!</h2>
        </div>
      )}
      {createUserAction.value?.error && (
        <div>
          <h2>Error: {createUserAction.value.error}</h2>
        </div>
      )}
    </section>
  );
});
