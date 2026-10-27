import { Delete, FilePresent, UploadFile } from "@mui/icons-material";
import { Box, BoxProps, Grid, GridProps, IconButton, SxProps, Tooltip, useTheme } from "@mui/material";
import { get } from "lodash";
import React, { ChangeEvent, useCallback, useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";
import ReactLoading from "react-loading";
import { v4 as uuidv4 } from "uuid";
import { useAppStore, useStudentStore } from "../../../../hooks";
import { uploadImage } from "../../../../services";

interface FormFileProps {
  filePath: string;
  folderName: string;
  gridProps: GridProps;
  loadingContainerProps?: BoxProps & { transform?: string };
}

export const FormFile: React.FC<FormFileProps> = ({ folderName, filePath, loadingContainerProps, gridProps }) => {
  const selectedStudent = useStudentStore((state) => {
    return state.selectedStudent;
  });
  const role = useAppStore((state) => {
    return state.role;
  });
  const theme = useTheme();
  const methods = useFormContext();

  const fileName = get(selectedStudent, filePath);
  const [file, setFile] = useState<string | undefined>(fileName);
  const [loading, setLoading] = useState(false);

  const inputId = useMemo(() => {
    return uuidv4();
  }, []);

  const onInputChange = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      setLoading && setLoading(true);
      const fileInput = e.target.files && e.target.files[0];
      const fileURL = await uploadImage(
        selectedStudent?.epId || methods?.getValues("epId"),
        fileInput,
        folderName,
      );
      methods?.setValue && methods.setValue(filePath, fileURL);
      setFile(fileURL);
      setLoading && setLoading(false);
    },
    [filePath, folderName, methods, selectedStudent?.epId],
  );
  const outerContainerProps = { position: "relative", top: "50%", transform: "translate(0%, -50%)" };
  const innerContainerProps: SxProps = {
    left: "50%",
    margin: 0,
    position: "absolute",
    top: "50%",
    transform: "translate(-50%, -50%)",
  };

  return (
    <Grid item {...gridProps}>
      {loading && (
        <Box sx={outerContainerProps}>
          <Box
            sx={{
              ...innerContainerProps,
              ...loadingContainerProps,
            }}
          >
            <ReactLoading color={theme.palette.primary.main} type="cylon" />
          </Box>
        </Box>
      )}
      {file && !loading ? (
        <Box sx={outerContainerProps}>
          <Box sx={innerContainerProps}>
            <Tooltip arrow title="File Uploaded">
              <FilePresent sx={{ transform: "scale(2)" }} />
            </Tooltip>
          </Box>
        </Box>
      ) : (
        <Box sx={outerContainerProps}>
          <Box sx={innerContainerProps}>
            {!file && !loading && role === "admin" && (
              <label htmlFor={inputId}>
                <input accept=".pdf" hidden id={inputId} onChange={onInputChange} type="file" />
                <Tooltip arrow title="Upload File">
                  <IconButton color="primary" component="span" sx={{ transform: `scale(2)` }}>
                    <UploadFile />
                  </IconButton>
                </Tooltip>
              </label>
            )}
          </Box>
        </Box>
      )}
      {file && !loading && (
        <Box display="flex" flexDirection="column">
          <label htmlFor={inputId}>
            <input accept=".pdf" hidden id={inputId} onChange={onInputChange} type="file" />
            <Tooltip arrow title="Replace File">
              <IconButton color="primary" component="span">
                <UploadFile />
              </IconButton>
            </Tooltip>
          </label>
          <Box>
            <Tooltip arrow title="Delete File">
              <IconButton
                color="primary"
                onClick={() => {
                  methods?.setValue(filePath, undefined);
                  setFile(undefined);
                }}
              >
                <Delete />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      )}
    </Grid>
  );
};
