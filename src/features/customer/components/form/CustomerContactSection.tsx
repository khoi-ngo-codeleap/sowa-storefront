import React from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CustomerContactValue } from "./schema";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { SelectOption } from "@/types/select";

type CustomerContactSectionProps = {
  localeOptions: SelectOption[];
};
const CustomerContactSection: React.FC<CustomerContactSectionProps> = ({
  localeOptions,
}) => {
  const methods = useFormContext<CustomerContactValue>();
  return (
    <div className="grid gap-4 py-2">
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={methods.control}
          name="first_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={methods.control}
          name="last_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={methods.control}
        name="locale"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Language</FormLabel>
            <FormControl>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a language" />
                </SelectTrigger>
                <SelectContent>
                  {localeOptions.map((locale) => (
                    <SelectItem key={locale.value} value={locale.value}>
                      {locale.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormDescription>
              This customer will receive notifications in this language.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={methods.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={methods.control}
        name="phone"
        render={({ field }) => {
          return (
            <FormItem>
              <FormLabel>Phone number</FormLabel>
              <FormControl>
                <Input
                  type="tel"
                  placeholder="Enter phone number"
                  className="flex-1"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          );
        }}
      />
    </div>
  );
};

export default CustomerContactSection;
