import { Button, Grid, GridProps, Typography, useTheme } from "@mui/material";
import { grey } from "@mui/material/colors";
import { get, map, reverse } from "lodash";
import React, { Attributes } from "react";
import { useFormContext } from "react-hook-form";
import { SPACING } from "../../services";

interface FormListProps {
  addItem: () => void;
  buttonGridProps?: GridProps;
  buttonLabel: string;
  children?: React.ReactNode;
  list: unknown[];
  listName: string;
  removeItem: (index?: number) => () => void;
  reverseList?: boolean;
}

export const FormList: React.FC<FormListProps> = ({
  list,
  listName,
  addItem,
  removeItem,
  buttonLabel,
  buttonGridProps,
  children,
  reverseList,
}) => {
  const theme = useTheme();
  const {
    formState: { errors },
  } = useFormContext();
  const errorMessage = get(errors, listName)?.message;

  const componentList = () => {
    return map(list, (item, i) => {
      // https://stackoverflow.com/questions/32370994/how-to-pass-props-to-this-props-children/39401252
      return React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            index: i,
            key: `${JSON.stringify(item)} ${i}`,
            name: `${listName}[${i}]`,
            removeItem,
          } as Partial<unknown> & Attributes);
        }
        return child;
      });
    });
  };

  const button = () => {
    return (
      <Grid item xs {...buttonGridProps}>
        <Button
          color={theme.palette.mode === "light" ? "secondary" : "primary"}
          onClick={addItem}
          sx={
            theme.palette.mode === "dark"
              ? {
                  backgroundColor: "#2C313A",
                  border: 1,
                  borderColor: grey[700],
                  borderRadius: 2,
                  fontWeight: "bold",
                  textTransform: "none",
                }
              : { borderRadius: 2, fontWeight: "bold", textTransform: "none" }
          }
          variant={theme.palette.mode === "light" ? "contained" : "text"}
        >
          {buttonLabel}
        </Button>
        {errorMessage && (
          <Typography
            color={theme.palette.error.main}
            fontSize={12}
            marginLeft={SPACING / 2}
            marginTop={SPACING / 2}
          >
            {errorMessage.toString()}
          </Typography>
        )}
      </Grid>
    );
  };

  return (
    <>
      {reverseList && button()}
      {reverseList ? reverse(componentList()) : componentList()}
      {!reverseList && button()}
    </>
  );
};

FormList.defaultProps = {
  buttonGridProps: undefined,
  children: undefined,
  reverseList: false,
};
