import { Button, Grid, GridProps, useTheme } from "@mui/material";
import { grey } from "@mui/material/colors";
import { map } from "lodash";
import React from "react";

interface FormListProps {
  addItem: () => void;
  buttonGridProps?: GridProps;
  buttonLabel: string;
  list: unknown[];
  listName: string;
  removeItem: (index?: number) => () => void;
}

export const FormList: React.FC<FormListProps> = ({
  list,
  listName,
  addItem,
  removeItem,
  buttonLabel,
  buttonGridProps,
  children,
}) => {
  const theme = useTheme();

  return (
    <>
      {map(list, (item, i) => {
        // https://stackoverflow.com/questions/32370994/how-to-pass-props-to-this-props-children/39401252
        return React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, {
              index: i,
              key: `${JSON.stringify(item)} ${i}`,
              name: `${listName}[${i}]`,
              removeItem,
            });
          }
          return child;
        });
      })}
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
      </Grid>
    </>
  );
};

FormList.defaultProps = {
  buttonGridProps: undefined,
};
