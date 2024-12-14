"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useSiteConfig } from "@/hooks/use-site-config";
import Loader from "@/components/ui/loader";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  subject: z.string(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

interface Location {
  address: string;
  city: string;
  postcode: string;
  country: string;
}

interface OpeningHours {
  opened: string;
  closed: string;
}

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { data: siteConfigs, isLoading } = useSiteConfig();
  const location = (siteConfigs?.location as Location) || null;
  const openingHours = (siteConfigs?.opening_hours as OpeningHours) || null;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      await fetch("/api/contact", {
        method: "POST",
        body: JSON.stringify(values),
      });

      toast({
        title: "Message sent!",
        description: "We'll get back to you as soon as possible.",
      });

      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-primary py-16 text-primary-foreground">
        <div className="container mx-auto px-4">
          <h1 className="mb-4 text-4xl font-bold">Contact Us</h1>
          <p className="text-lg opacity-90">
            We&apos;d love to hear from you. Get in touch with us.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Contact Information */}
          {isLoading ? (
            <Loader className="border-t-black" />
          ) : (
            <div className="space-y-8">
              <div>
                <h2 className="mb-6 text-2xl font-bold">Get in Touch</h2>
                <p className="mb-8 text-muted-foreground">
                  Have questions about our products or services? We&apos;re here
                  to help!
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <MapPin className="mt-1 h-6 w-6 text-primary" />
                  <div>
                    <h3 className="mb-1 font-semibold">Our Location</h3>
                    <p className="text-muted-foreground">
                      {location?.address || ""}
                      <br />
                      {location?.city || ""},{" "}
                      {location?.postcode.toUpperCase() || ""}
                      <br />
                      {location?.country || ""}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Mail className="mt-1 h-6 w-6 text-primary" />
                  <div>
                    <h3 className="mb-1 font-semibold">Email Us</h3>
                    <a
                      href={`mailto:${siteConfigs?.contact_email}`}
                      className="text-primary hover:underline"
                    >
                      {siteConfigs?.contact_email?.toString() || ""}
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Phone className="mt-1 h-6 w-6 text-primary" />
                  <div>
                    <h3 className="mb-1 font-semibold">Call Us</h3>
                    <a
                      href={`tel:${siteConfigs?.support_phone}`}
                      className="text-primary hover:underline"
                    >
                      {siteConfigs?.support_phone?.toString() || ""}
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Clock className="mt-1 h-6 w-6 text-primary" />
                  <div>
                    <h3 className="mb-1 font-semibold">Opening Hours</h3>
                    <p className="text-muted-foreground">
                      {openingHours?.opened || ""}
                      <br />
                      {openingHours?.closed || ""}: Closed
                    </p>
                  </div>
                </div>
              </div>

              {/* Map */}
              <div className="relative aspect-video overflow-hidden rounded-lg border">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2356.625719698069!2d-1.7595977227697837!3d53.79614877242321!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x487be14c5b98f0bb%3A0x7af7a4dea8d83b50!2sTropical%20Food%20Superstore!5e0!3m2!1sen!2sgh!4v1733673972891!5m2!1sen!2sgh"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          )}

          {/* Contact Form */}
          <div className="rounded-lg border bg-card p-8 max-sm:px-4">
            <h2 className="mb-6 text-2xl font-bold">Send Us a Message</h2>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="example@email.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject</FormLabel>
                      <FormControl>
                        <Input placeholder="What is this about?" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Your message..."
                          className="min-h-[150px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center space-x-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      <span>Sending...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Send className="h-4 w-4" />
                      <span>Send Message</span>
                    </div>
                  )}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
