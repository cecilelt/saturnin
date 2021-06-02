import React, {useState} from "react";
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import SemesterSelector from "../components/evaluations/SemesterSelector";
import '../styles/Evaluations.css'
import CourseSelector from "../components/evaluations/CourseSelector";
import GroupSelector from "../components/evaluations/GroupSelector";
import TestsList from "../components/evaluations/TestsList";
import StudentsGradesList from "../components/evaluations/StudentsGradesList";

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
    return ['Semestre', 'Matière', 'Groupe', "Tests", 'Étudiants'];
}

function Evaluations() {
    const classes = useStyles();
    const [activeStep, setActiveStep] = React.useState(0);
    const [skipped, setSkipped] = React.useState(new Set());
    const [semesterId, setSemesterId] = useState("");
    const [courseId, setCourseId] = useState("");
    const [groupId, setGroupId] = useState("");
    const [testId, setTestId] = useState("");

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
                return <SemesterSelector sendSemesterName={getSemester}/>
            case 1:
                return <CourseSelector semester={semesterId} sendCourseName={getCourseName}/>;
            case 2:
                return <GroupSelector sendGroup={getGroup}/>;
            case 3:
                return <TestsList sendTestId={getTest} semesterId={semesterId} courseId={courseId} groupId={groupId}/>;
            case 4:
                return <StudentsGradesList testId={testId} groupId={groupId}/>;
            default:
                return '';
        }
    }

    function getSemester(semester) {
        console.log("Semester Id: " + semester)
        setSemesterId(semester)
    }

    function getCourseName(course) {
        console.log("Course Id: " + course)
        setCourseId(course)
    }

    function getGroup(group) {
        console.log("Group Id: " + group)
        setGroupId(group)
    }

    function getTest(test) {
        console.log("Test Id: " + test)
        setTestId(test)
    }

    return(
        <div className={classes.root}>
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