import { sendMessage } from "@/app/websocket";


export const handleSubmit =
(body: string, receiver: string) =>
(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    sendMessage(body, receiver)
};