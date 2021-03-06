import React from 'react'
import Snackbar from '@material-ui/core/Snackbar'
import MuiAlert, {AlertProps} from '@material-ui/lab/Alert'
import { useSelector} from "react-redux";
import {AppRootStateType} from '../../utils/types';

import {useActions} from "../../utils/redux-utils";
import {appActions} from "../../features/common-action/App";




function Alert(props: AlertProps) {
    return <MuiAlert elevation={6} variant="filled" {...props} />
}

export function ErrorSnackbar() {
    // const [open, setOpen] = React.useState(true)
    const error = useSelector((state: AppRootStateType): string | null => state.app.error)
    const {setAppError} = useActions(appActions)
    const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
        if (reason === 'clickaway') {
            return
        }
        setAppError({error: null})
    }

    return (
        <Snackbar open={!!error} autoHideDuration={6000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="error">
                This is a success message!
            </Alert>
        </Snackbar>
    )
}

