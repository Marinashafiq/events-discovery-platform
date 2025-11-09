"use client";

import { useState, useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { BookingFormData } from "@/types/booking";
import { bookTicket } from "@/lib/api/tickets";
import BookingSuccessModal from "./BookingSuccessModal";
import ErrorAlert from "../ErrorAlert";

interface BookingFormProps {
  eventSlug: string;
  eventTitle: string;
}

function createBookingSchema(tValidation: (key: string) => string) {
  return z.object({
    name: z.string().min(1, tValidation("nameRequired")),
    email: z
      .string()
      .min(1, tValidation("emailRequired"))
      .email(tValidation("emailInvalid")),
    mobile: z
      .string()
      .min(1, tValidation("mobileRequired"))
      .regex(
        /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/,
        tValidation("mobileInvalid")
      ),
    date: z.string().min(1, tValidation("dateRequired")),
  });
}

function BookingFormContent({ eventSlug, eventTitle }: BookingFormProps) {
  const t = useTranslations("booking.form");
  const tValidation = useTranslations("booking.validation");
  const tError = useTranslations("booking.error");
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const bookingSchema = useMemo(() => {
    return createBookingSchema(tValidation);
  }, [tValidation]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: BookingFormData) => {
    setIsSubmitting(true);

    try {
      const result = await bookTicket(eventSlug, data);
      if (result.success) {
        setShowSuccessModal(true);
        reset(); // Clear form on success
      } else {
        setErrorMessage(result.error || tError("message"));
      }
    } catch (error) {
      setErrorMessage(tError("message"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    router.push("/tickets");
  };

  const handleErrorDismiss = () => {
    setErrorMessage("");
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            {t("name")}
          </label>
          <input
            type="text"
            id="name"
            {...register("name")}
            placeholder={t("namePlaceholder")}
            className={`w-full px-4 py-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.name
                ? "border-red-500"
                : "border-gray-300 dark:border-gray-600"
            }`}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.name.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            {t("email")}
          </label>
          <input
            type="email"
            id="email"
            {...register("email")}
            placeholder={t("emailPlaceholder")}
            className={`w-full px-4 py-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.email
                ? "border-red-500"
                : "border-gray-300 dark:border-gray-600"
            }`}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="mobile"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            {t("mobile")}
          </label>
          <input
            type="tel"
            id="mobile"
            {...register("mobile")}
            placeholder={t("mobilePlaceholder")}
            className={`w-full px-4 py-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.mobile
                ? "border-red-500"
                : "border-gray-300 dark:border-gray-600"
            }`}
          />
          {errors.mobile && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.mobile.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="date"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            {t("date")}
          </label>
          <input
            type="date"
            id="date"
            {...register("date")}
            className={`w-full px-4 py-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.date
                ? "border-red-500"
                : "border-gray-300 dark:border-gray-600"
            }`}
          />
          {errors.date && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {tValidation("dateRequired")}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed transition-colors font-semibold"
        >
          {isSubmitting ? t("submitting") : t("submit")}
        </button>
      </form>

      {/* Error Alert - Displayed below the form */}
      <ErrorAlert
        title={tError("title")}
        message={errorMessage}
        onDismiss={handleErrorDismiss}
      />

      {showSuccessModal && (
        <BookingSuccessModal
          isOpen={showSuccessModal}
          onClose={handleSuccessClose}
        />
      )}
    </>
  );
}

export default function BookingForm({
  eventSlug,
  eventTitle,
}: BookingFormProps) {
  const locale = useLocale();

  return (
    <BookingFormContent
      key={locale}
      eventSlug={eventSlug}
      eventTitle={eventTitle}
    />
  );
}
