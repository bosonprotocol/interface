import * as Sentry from "@sentry/browser";
import React, { useRef, useState } from "react";
import AvatarEditor from "react-avatar-editor";

import { dataURItoBlob } from "../../../../lib/utils/base64";
import { useFileImage } from "../../../../lib/utils/hooks/images/useFileImage";
import {
  ImageEditor,
  ImageEditorProps
} from "../../../form/Upload/ImageEditor";
import { Spinner } from "../../../loading/Spinner";
import BosonButton from "../../../ui/BosonButton";
import Grid from "../../../ui/Grid";
import Modal from "../../Modal";

type ImageEditorModal = Omit<ImageEditorProps, "url"> & {
  files: File[] | null;
  hideModal: (files?: File[]) => Promise<void>;
};

export const ImageEditorModal: React.FC<ImageEditorModal> = ({
  hideModal,
  files,
  ...rest
}) => {
  const originalFile = files?.[0];
  const { data: url } = useFileImage(
    { file: originalFile },
    { enabled: !!originalFile }
  );
  const editorRef = useRef<AvatarEditor>(null);
  const [isSaving, setSaving] = useState<boolean>(false);
  const onClickSave = async () => {
    setSaving(true);
    try {
      const img = editorRef.current?.getImageScaledToCanvas().toDataURL();
      if (!img) {
        return;
      }
      const blob = dataURItoBlob(img);
      const file = new File([blob], originalFile?.name ?? "edited", {
        type: originalFile?.type,
        lastModified: originalFile?.lastModified
      });
      if (!file) {
        return;
      }
      await hideModal([file]);
    } catch (error) {
      Sentry.captureException(error);
    } finally {
      setSaving(false);
    }
  };
  return (
    <Modal
      modalType="IMAGE_EDITOR"
      hideModal={() => hideModal()}
      size="auto"
      maxWidths={{
        s: "50rem"
      }}
      theme="light"
    >
      <Grid flexDirection="column">
        <ImageEditor url={url} {...rest} ref={editorRef} />
        <BosonButton
          type="button"
          onClick={() => onClickSave()}
          disabled={isSaving}
        >
          {isSaving ? "Saving" : "Save"}
          {isSaving && <Spinner />}
        </BosonButton>
      </Grid>
    </Modal>
  );
};
