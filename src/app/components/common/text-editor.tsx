import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { EditorState, convertToRaw } from "draft-js";
import { Control, Controller } from "react-hook-form";
import draftToHtml from "draftjs-to-html";
import clsx from "clsx";

const hashConfig = {
  trigger: "#",
  separator: " ",
};

export const TextEditor = ({
  control,
  name,
  setValue,
  withPreview = true,
  className,
}: {
  control: Control;
  name: string;
  setValue: any;
  withPreview?: boolean;
  className?: string;
}) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onBlur, onChange, value } }) => {
        const convertedState =
          value?._immutable && convertToRaw(value?.getCurrentContent());
        const markup = draftToHtml(convertedState, hashConfig);

        return (
          <>
            <Editor
              editorState={value || EditorState?.createEmpty()}
              onEditorStateChange={(e) => {
                onChange(e);
                const res = draftToHtml(
                  convertToRaw(e?.getCurrentContent()),
                  hashConfig
                );
                setValue("desc", res);
              }}
              toolbarClassName="toolbarClassName text-black"
              wrapperClassName="wrapperClassName"
              editorClassName={clsx(
                "editorClassName p-2 form-control",
                className
              )}
              onBlur={onBlur}
              toolbar={{
                options: ["inline", "list", "link"],
                inline: {
                  options: ["bold", "italic", "underline"],
                },
                list: { options: ["unordered", "ordered"] },
                link: { showOpenOptionOnHover: false },
              }}
            />

            {withPreview ? (
              <div className="card border my-3">
                <p className="px-5 pt-8 card-header text-bold">Preview</p>
                <div
                  dangerouslySetInnerHTML={{ __html: markup }}
                  className="card-body"
                />
              </div>
            ) : null}
          </>
        );
      }}
    />
  );
};
