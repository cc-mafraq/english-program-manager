import { Button, Grid } from "@mui/material";
import { map } from "lodash";
import React from "react";

interface FormListProps {
  addItem: () => void;
  buttonLabel: string;
  list: unknown[];
  removeItem: (index?: number) => () => void;
}

export const FormList: React.FC<FormListProps> = ({
  list,
  addItem,
  removeItem,
  buttonLabel,
  children,
}) => {
  return (
    <>
      {map(list, (item, i) => {
        // https://stackoverflow.com/questions/32370994/how-to-pass-props-to-this-props-children/39401252
        return React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, {
              index: i,
              key: `${JSON.stringify(item)} ${i}`,
              removeItem,
            });
          }
          return child;
        });
      })}
      <Grid item xs>
        <Button color="secondary" onClick={addItem} variant="contained">
          {buttonLabel}
        </Button>
      </Grid>
    </>
  );
};
