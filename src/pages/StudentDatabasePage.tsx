import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  IconButton,
  Typography,
  TypographyProps,
} from '@mui/material';
import React from 'react';
import EditIcon from '@mui/icons-material/Edit';
import PersonIcon from '@mui/icons-material/Person';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { StudentDatabaseToolbar } from '../components';
import { Nationality, SAMPLE_STUDENTS, Status, Student } from '../interfaces';
import { map } from 'lodash';

interface EditableStudent extends Student {
  isEditMode: boolean;
}

const typographyLineProps: TypographyProps = {
  display: 'inline',
  variant: 'body1',
  marginRight: '5%',
};

export const StudentDatabasePage = () => {
  return (
    <>
      <StudentDatabaseToolbar />
      {map(SAMPLE_STUDENTS, (student) => (
        <Card sx={{ display: 'flex' }}>
          <Box
            sx={{
              minWidth: '10%',
              maxWidth: '10%',
            }}
          >
            <CardMedia
              sx={{ height: '100%', maxHeight: '35vh' }}
              component="img"
              image={`./assets/${student.epId}.png`}
            />
          </Box>
          <Box sx={{ flexGrow: 5 }}>
            <CardContent>
              <Typography
                gutterBottom
                variant="h5"
                component="div"
                display="inline"
              >
                {student.name.english} {student.name.arabic}
              </Typography>
              <Box sx={{ float: 'right', flexGrow: 1, flexDirection: 'row' }}>
                <Typography display="inline" variant="h5" marginRight="5px">
                  {
                    student.phone.phoneNumbers[student.phone.primaryPhone]
                      .number
                  }
                </Typography>
                {student.phone.hasWhatsapp ? (
                  <IconButton
                    href={`https://wa.me/962${
                      student.phone.phoneNumbers[student.phone.primaryPhone]
                        .number
                    }`}
                    target="_blank"
                  >
                    <WhatsAppIcon />
                  </IconButton>
                ) : (
                  <></>
                )}
              </Box>
              <Box sx={{ marginTop: '1%', marginBottom: '1%' }}>
                <Typography {...typographyLineProps}>
                  {Nationality[student.nationality]}
                </Typography>
                <Typography {...typographyLineProps}>{student.epId}</Typography>
                <Typography {...typographyLineProps}>
                  {student.status.inviteTag ? 'Y' : 'N'}
                </Typography>
                <Typography {...typographyLineProps}>
                  {student.currentLevel}
                </Typography>
                <Typography {...typographyLineProps}>
                  {Status[student.status.currentStatus]}
                </Typography>
                <Typography {...typographyLineProps}>
                  {student.gender}
                </Typography>
                <Typography {...typographyLineProps}>
                  {student.work.occupation}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                {student.correspondence}
              </Typography>
            </CardContent>
          </Box>
          <CardActions>
            <IconButton>
              <PersonIcon />
            </IconButton>
            <IconButton>
              <EditIcon />
            </IconButton>
          </CardActions>
        </Card>
      ))}
    </>
  );
};
