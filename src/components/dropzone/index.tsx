import React, { ChangeEvent, useRef } from "react";
import { UseFormReturn } from "react-hook-form";
import { FileCheck2Icon } from "lucide-react";
import { mixed } from "yup";

import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { ErrorMessage } from "@/utils/error.enum";
import { cn } from "@/lib/utils";

const ACEPTED_DOC_TYPE = ["jpg", "png", "pdf"];

const MAX_FILE_SIZE = 1024 * 1024 * 2; // 2MB

const isValidFileType = (fileName: string) => {
  const ext = fileName.split(".").pop() ?? "jpg";
  const isValid = fileName && ACEPTED_DOC_TYPE.includes(ext);
  return !!isValid;
};

const isValidFileSize = (value: File | null) => {
  const isValid = value && value?.size <= MAX_FILE_SIZE;
  return !!isValid;
};

export const fileBaseSchema = mixed<any>()
  .required(ErrorMessage.invalidFile)
  .test("is-valid-type", ErrorMessage.invalidFileFormat, (value) =>
    isValidFileType(value?.name?.toLowerCase())
  )
  .test("is-valid-size", ErrorMessage.invalidFileLength, (value) =>
    isValidFileSize(value)
  );

interface DropzoneProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "value" | "onChange"
  > {
  classNameWrapper?: string;
  className?: string;
  dropMessage: string;
  handleOnDrop: (acceptedFiles: FileList | null) => void;
}

type DropzoneControolledProps = {
  form: UseFormReturn<any>;
  name: string;
};

export default function DropzoneControlled(props: DropzoneControolledProps) {
  function handleOnDrop(fileList: FileList | null) {
    if (fileList && fileList.length > 0) {
      const file = fileList[0];

      if (!isValidFileSize(file)) {
        props.form.setValue(`${props.name}`, null);
        props.form.setError(`${props.name}`, {
          message: ErrorMessage.invalidFileLength,
          type: "typeError",
        });
      } else if (!isValidFileType(file.name)) {
        props.form.setValue(`${props.name}`, null);
        props.form.setError(`${props.name}`, {
          message: ErrorMessage.invalidFileFormat,
          type: "typeError",
        });
      } else {
        props.form.setValue(`${props.name}`, file);
        props.form.clearErrors(`${props.name}`);
      }
    } else {
      props.form.setValue(`${props.name}`, null);
      props.form.setError(`${props.name}`, {
        message: ErrorMessage.invalidFile,
        type: "typeError",
      });
    }
  }

  return (
    <>
      <FormField
        control={props.form.control}
        name={props.name}
        render={({ field }) => {
          return (
            <FormItem className="w-full">
              <FormControl>
                <Dropzone
                  {...field}
                  dropMessage="Click ou arraste os arquivos"
                  handleOnDrop={handleOnDrop}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          );
        }}
      />

      {props.form.watch(`${props.name}`) && (
        <div className="flex items-center justify-center gap-3 p-4 relative">
          <FileCheck2Icon className="h-4 w-4" />
          <p className="text-sm font-medium">
            {props.form.watch(`${props.name}`)?.name}
          </p>
        </div>
      )}
    </>
  );
}

const Dropzone = React.forwardRef<HTMLDivElement, DropzoneProps>(
  (
    { className, classNameWrapper, dropMessage, handleOnDrop, ...props },
    ref
  ) => {
    const inputRef = useRef<HTMLInputElement | null>(null);

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      handleOnDrop(null);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      const { files } = e.dataTransfer;
      if (inputRef.current) {
        inputRef.current.files = files;
        handleOnDrop(files);
      }
    };

    const handleButtonClick = () => {
      if (inputRef.current) {
        inputRef.current.click();
      }
    };
    return (
      <Card
        ref={ref}
        className={cn(
          `mt-2 border-2 border-dashed bg-muted hover:cursor-pointer hover:border-muted-foreground/50`,
          classNameWrapper
        )}
      >
        <CardContent
          className="flex flex-col items-center justify-center space-y-2 px-2 py-6 text-xs"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={handleButtonClick}
        >
          <div className="flex items-center justify-center text-muted-foreground">
            <span className="text-sm font-medium leading-none">
              {dropMessage}
            </span>
            <Input
              {...props}
              value={undefined}
              ref={inputRef}
              type="file"
              className={cn("hidden", className)}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleOnDrop(e.target.files)
              }
            />
          </div>
        </CardContent>
      </Card>
    );
  }
);
