import { Card, Classes, NonIdealState, Spinner, SpinnerSize } from '@blueprintjs/core';
import classNames from 'classnames';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Navigate, Outlet, useNavigate, useParams } from 'react-router';
import ResearchAgreementPrompt from 'src/commons/researchAgreementPrompt/ResearchAgreementPrompt';
import Constants from 'src/commons/utils/Constants';
import { useSession, useTypedSelector } from 'src/commons/utils/Hooks';
import classes from 'src/styles/Academy.module.scss';
import warningClasses from 'src/styles/DisableDevtoole.module.scss';

import SessionActions from '../../commons/application/actions/SessionActions';
import { calculateTime, createLargeObjectArray } from '../../commons/disableDevtool/utils';
import { numberRegExp } from '../../features/academy/AcademyTypes';

const Academy: React.FC = () => {
  const dispatch = useDispatch();
  const [largeObject] = useState(createLargeObjectArray());
  const [maxPrintTime, setMaxPrintTime] = useState(0);
  // const [failCount, setFailCount] = useState(0);
  React.useEffect(() => {
    const devtoolOpenWarning = document.createElement('div');
    devtoolOpenWarning.id = 'devtools-warning';
    devtoolOpenWarning.className = warningClasses['Devtools-Warning'];
    devtoolOpenWarning.innerHTML =
      '<p>⚠️ WARNING: Usage of DevTools is strictly prohibited and could be considered an act of dishonesty.</p>\
      <p>Please close the DevTool before closing this warning.</p>\
      <button id="closeDevToolsWarning">Close</button>';

    
    setInterval(() => {
      const tablePrintTime = calculateTime(() => {
        console.table(Object.assign({}, largeObject));
      });
      const logPrintTime = calculateTime(() => {
        console.log(Object.assign({}, largeObject));
      });
      setMaxPrintTime(Math.max(maxPrintTime, logPrintTime));
      console.clear();
      
      if (tablePrintTime === 0 || maxPrintTime === 0) {
        return null;
      }

      if (tablePrintTime > maxPrintTime * 10) {
        const warning = document.getElementById('devtools-warning');
        if (warning == null) {
          document.body.appendChild(devtoolOpenWarning);
              const button = document.getElementById('closeDevToolsWarning');
              if (button) {
                button.onclick = () => devtoolOpenWarning?.remove();
              }
        } 
      }

      return null;
    }, 2000)
  });

  React.useEffect(() => {
    dispatch(SessionActions.fetchStudents());
    dispatch(SessionActions.fetchNotifications());
    dispatch(SessionActions.fetchTeamFormationOverviews(false));
  }, [dispatch]);
  const { agreedToResearch } = useSession();

  return (
    <div className={classes['Academy']}>
      {/* agreedToResearch has a default value of undefined in the store.
            It will take on null/true/false when the backend returns. */}
      {Constants.showResearchPrompt && agreedToResearch === null && <ResearchAgreementPrompt />}
      <Outlet />
    </div>
  );
};

const CourseSelectingAcademy: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { courseId } = useSession();
  const { courseId: routeCourseIdStr } = useParams<{ courseId?: string }>();
  const routeCourseId = routeCourseIdStr != null ? parseInt(routeCourseIdStr, 10) : undefined;
  const isUnderExamMode = useTypedSelector(state => state.session.enableExamMode);
  // const isdDevtoolOpen = useDevToolsDetection();
  // useDevToolsDateDetection(
  //   () => alert('devtool is open!'),
  //   () => alert('devtool closed!')
  // );


  React.useEffect(() => {
    // Regex to handle case where routeCourseIdStr is not a number
    if (!routeCourseIdStr?.match(numberRegExp)) {
      return navigate('/');
    }

    if (routeCourseId !== undefined && !Number.isNaN(routeCourseId) && courseId !== routeCourseId) {
      dispatch(SessionActions.updateLatestViewedCourse(routeCourseId));
    }

    if (isUnderExamMode) {
      navigate(`/courses/${courseId}`);
    }

    // if (isdDevtoolOpen) {
    //   alert("devtool not allowed");
    // }
  }, [courseId, dispatch, routeCourseId, navigate, routeCourseIdStr, isUnderExamMode]);

  return Number.isNaN(routeCourseId) ? (
    <Navigate to="/" />
  ) : routeCourseId === courseId ? (
    <Academy />
  ) : (
    <div className={classNames(classes['Academy-switching-courses'], Classes.DARK)}>
      <Card className={Classes.ELEVATION_4}>
        <NonIdealState
          description="Switching courses..."
          icon={<Spinner size={SpinnerSize.LARGE} />}
        />
      </Card>
    </div>
  );
};

// react-router lazy loading
// https://reactrouter.com/en/main/route/lazy
export const Component = CourseSelectingAcademy;
Component.displayName = 'Academy';

export default CourseSelectingAcademy;
