import Form from 'next/form'
export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <Form action="/submit">
          <input type="text" name="link" placeholder="Enter your link" />
          <button type="submit">Shorten Link</button>
        </Form>
      </main>
    </div>
  );
}
