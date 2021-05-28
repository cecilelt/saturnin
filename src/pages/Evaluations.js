import React, {useState} from "react";
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import SemesterSelector from "../components/SemesterSelector";
import '../styles/Evaluations.css'
import CourseSelector from "../components/CourseSelector";
import GroupSelector from "../components/GroupSelector";

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    button: {
        marginRight: theme.spacing(1),
    },
    instructions: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
}));

function getSteps() {
    return ['Semestre', 'Matière', 'Groupe', "Évaluation", 'Étudiants'];
}



function Evaluations() {
    const classes = useStyles();
    const [activeStep, setActiveStep] = React.useState(0);
    const [skipped, setSkipped] = React.useState(new Set());
    const [semesterName, setSemesterName] = useState([]);
    const [courseName, setCourseName] = useState([]);
    const [group, setGroup] = useState([]);

    const steps = getSteps();

    const isStepSkipped = (step) => {
        return skipped.has(step);
    };

    const handleNext = () => {
        let newSkipped = skipped;
        if (isStepSkipped(activeStep)) {
            newSkipped = new Set(newSkipped.values());
            newSkipped.delete(activeStep);
        }

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSkipped(newSkipped);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    function getStepContent(step) {
        switch (step) {
            case 0:
                return <SemesterSelector sendSemesterName={getData}/>
            case 1:
                return <CourseSelector semester={semesterName} sendCourseName={getCourseName}/>;
            case 2:
                return <GroupSelector sendGroup={getGroup}/>;
            case 3:
                return 'Liste des évaluations';
            case 4:
                return 'Liste des étudiants';
            default:
                return '';
        }
    }

    function getData(val) {
        setSemesterName(val)
    }

    function getCourseName(courseName) {
        setCourseName(courseName)
    }

    function getGroup(group) {
        setGroup(group)
    }


    return(
        <div className={classes.root}>
            <h1 class="pageHeader">Évaluer</h1>
            <div class="stepper-container">
                <Stepper activeStep={activeStep}>
                    {steps.map((label, index) => {
                        const stepProps = {};
                        const labelProps = {};
                        if (isStepSkipped(index)) {
                            stepProps.completed = false;
                        }
                        return (
                            <Step key={label} {...stepProps}>
                                <StepLabel {...labelProps}>{label}</StepLabel>
                            </Step>
                        );
                    })}
                </Stepper>
            </div>

            <div>
                {activeStep === steps.length ? (
                    <div class="button-container">
                        <Typography id="saved-info" className={classes.instructions}>
                            Informations enregistrées!
                        </Typography>
                        <Button onClick={handleReset} className={classes.button}>
                            Recommencer
                        </Button>
                    </div>
                ) : (
                    <div>
                        <Typography className={classes.instructions}>{getStepContent(activeStep)}</Typography>
                        <div class="buttons-div">
                                <Button disabled={activeStep === 0} onClick={handleBack} className={classes.button}>
                                    Retour
                                </Button>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleNext}
                                    className={classes.button}
                                >
                                    {activeStep === steps.length - 1 ? 'Enregistrer' : 'Prochain'}
                                </Button>

                        </div>
                    </div>
                )}
            </div>
        </div>
    );

}

export default Evaluations;