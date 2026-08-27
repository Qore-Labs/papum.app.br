"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  contactFormSchema,
  type ContactFormValues,
} from "@/schemas/contact-form";

export function ContactForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
  });

  const onSubmit = async (values: ContactFormValues) => {
    // TODO: substituir por uma Server Action ou chamada de API real
    console.log(values);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="name" className="text-sm font-medium">
          Nome
        </label>
        <input
          id="name"
          className="h-10 rounded-md border border-zinc-300 px-3 text-sm"
          {...register("name")}
        />
        {errors.name && (
          <span className="text-sm text-red-600">{errors.name.message}</span>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="text-sm font-medium">
          E-mail
        </label>
        <input
          id="email"
          type="email"
          className="h-10 rounded-md border border-zinc-300 px-3 text-sm"
          {...register("email")}
        />
        {errors.email && (
          <span className="text-sm text-red-600">{errors.email.message}</span>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="message" className="text-sm font-medium">
          Mensagem
        </label>
        <textarea
          id="message"
          rows={4}
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm"
          {...register("message")}
        />
        {errors.message && (
          <span className="text-sm text-red-600">{errors.message.message}</span>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Enviando..." : "Enviar"}
      </Button>
    </form>
  );
}
