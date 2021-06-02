import React, {useEffect, useState} from "react";
import {DataGrid, getThemePaletteMode} from '@material-ui/data-grid';
import makeStyles from "@material-ui/core/styles/makeStyles";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import axios from "axios";

const defaultTheme = createMuiTheme();
const useStyles = makeStyles(
    (theme) => {
        const isDark = getThemePaletteMode(theme.palette) === 'dark';

        return {
            root: {
                '& .MuiDataGrid-cellEditing': {
                    backgroundColor: 'rgb(255,215,115, 0.19)',
                    color: '#1a3e72',
                },
                '& .Mui-error': {
                    backgroundColor: `rgb(126,10,15, ${isDark ? 0 : 0.1})`,
                    color: isDark ? '#ff4343' : '#750f0f',
                },
            },
        };
    },
    { defaultTheme },
);

function StudentsGradesList(props) {
    const [gradesList, setGradesList] = useState([]);
    const [editRowsModel, setEditRowsModel] = React.useState({});
    const classes = useStyles();

    useEffect(() => {
        let mounted = true;
        axios.get("/grades/" + props.testId + "/" + props.groupId).then((response) => {
            if(mounted)
            {
                if(Object.keys(response.data).length !== 0 && response.data.constructor !== Object)
                {
                    setGradesList(response.data);
                    gradesList.map((grade) => {
                        grade['id'] = grade._id
                    })
                }

            }
        });
        return () => mounted = false;
    }, []);

    const handleEditCellChange = React.useCallback(
        ({ id, field, props }) => {
            if (field === 'gradePercentage') {
                const data = props; // Fix eslint value is missing in prop-types for JS files
                const isValid = validateGrade(data.value);
                const newState = {};
                newState[id] = {
                    ...editRowsModel[id],
                    gradePercentage: { ...props, error: !isValid },
                };
                setEditRowsModel((state) => ({ ...state, ...newState }));
                if (isValid)
                {
                    modifyGrade(props.value, id)
                }
            }
            else if (field === 'isPresent') {
                console.log(JSON.stringify(props))
                modifyIsPresent(props.value, id)
            }
        },
        [editRowsModel],
    );

    function modifyGrade(newGradePercentage, gradeId) {
        const modifiedGrade = {
            gradePercentage: newGradePercentage,
        };
        axios.patch("/grades/" + gradeId, modifiedGrade)
        axios.get("/grades/" + props.testId + "/" + props.groupId).then((response) => {
            setGradesList(response.data);
            gradesList.map((grade) => {
                grade['id'] = grade._id
            })
        });
    }

    function modifyIsPresent(newIsPresent, gradeId) {
        const modifiedIsPresent = {
            isPresent: newIsPresent,
        };
        axios.patch("/grades/" + gradeId, modifiedIsPresent)
        axios.get("/grades/" + props.testId + "/" + props.groupId).then((response) => {
            setGradesList(response.data);
            console.log(gradesList)
            gradesList.map((grade) => {
                grade['id'] = grade._id
            })
        });
    }

    function validateGrade(grade) {
        return grade >= 0 && grade <= 100;
    }

    return (
        <div style={{ height: 700, width: '65%', margin: 'auto' }}>
            <DataGrid
                className={classes.root}
                rows={gradesList}
                columns={columns}
                editRowsModel={editRowsModel}
                onEditCellChange={handleEditCellChange}
                id={(row) => row._id}
            />
        </div>
  );
}

const columns = [
    {
        field: '_id',
        headerName: "Identifiant de l'élève",
        hide: true,
        width: 200,
        identity: true,
        editable: false,
    },
    {
        field: 'studentName',
        headerName: "Nom de l'élève",
        type: 'string',
        width: 200,
        editable: false,
    },
    {
        field: 'isPresent',
        headerName: 'Présent',
        type: 'boolean',
        width: 200,
        editable: true
    },
    {
        field: 'gradePercentage',
        headerName: 'Pourcentage',
        type: 'number',
        width: 200,
        editable: true,
    },
    {
        field: 'gradeBI',
        headerName: 'Note du BI',
        type: 'number',
        width: 200,
        editable: false,
    },
];

export default StudentsGradesList;
