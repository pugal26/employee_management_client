import React, { useEffect, useState } from 'react'
import { Button, Typography, Box, Table, TableBody, TableCell, TableHead, TableRow, Grid, TextField, IconButton, Modal, TextareaAutosize, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const TimeTracking = () => {
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [timeLogs, setTimeLogs] = useState([]);
    const [sheets, setSheets] = useState([{ name: '', link: ''},{ name: '', link: ''},{ name: '', link: ''}]);
    const [isSheetFilled, setIsSheetFilled] = useState(false);
    const [isCommentModalOpen, setIsCommentModelOpen] = useState(false);
    const [isLeaveModelOpen, setIsLeaveModelOpen] = useState(false);
    const [comment, setComment] = useState('');
    const [leaveReason, setLeaveReason] = useState('');
    const [leaveOption, setLeaveOption] = useState('today');
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);

    useEffect(() => {
        let timer;
        if (isTimerRunning) {
            timer = setInterval(() => {
                setElapsedTime((prevElapsedTime) => prevElapsedTime + 1);
            }, 1000); 
        } else {
            clearInterval(timer);
        }
        return () => {
            clearInterval(timer);
        };
    }, [isTimerRunning]);

    useEffect(() => {
         // Check if any sheet has at least one field filled
        const filled = sheets.some(sheet => sheet.name.trim() !== '' || sheet.link.trim() !=='');
        setIsSheetFilled(filled);
    }, [sheets]);
    
    const handleLoginClick = () => {
        setIsTimerRunning(true);
        const currentTime = new Date();
        const loginTime = new Date().toLocaleTimeString();
        const date = `${String(currentTime.getDate()).padStart(2, '0')}-${currentTime.toLocaleString('default', { month: 'long'})}-${currentTime.getFullYear()}`;
        const day = currentTime.toLocaleDateString(undefined, {weekday: 'long'});
        setTimeLogs((prevLogs) => [...prevLogs, { date, day, login: loginTime, logout: null, sheets: [...sheets], comment: '' }]);
        setElapsedTime(0);
        setSheets([{name: '', link: ''}, {name: '', link: ''},{name: '', link: ''}])// Clear input fields after logging
    };

    const handleLogoutClick = () => {
        setIsTimerRunning(false);
        const logoutTime = new Date().toLocaleTimeString();
        setTimeLogs((prevLogs) => 
            prevLogs.map((log, index) => 
            index === prevLogs.length -1 ? {...log, logout: logoutTime } : log
            )
        );
        setElapsedTime(0);
        setSheets([{name: '', link: ''}, {name: '', link: ''},{name: '', link: ''}])// Clear input fields after logging
    };

    const handleSheetChange = (index, field, value) => {
        const newSheets = sheets.map((sheet, i) => (i === index ? {...sheet, [field]: value} : sheet));
        setSheets(newSheets);
    };

    const handleAddSheet = (index) => {
        setTimeLogs((prevLogs) => 
            prevLogs.map((log, logIndex) =>
                logIndex === prevLogs.length -1
                ? {...log, sheets: log.sheets.map((sheet, sheetIndex) => sheetIndex === index ? sheets[index] : sheet) }
                : log
            )
        );
        setSheets(sheets.map((sheet, i) => (i === index ? {name: '', link: ''} : sheet)));// Clear the added input fields
    };

    const handleOpenCommentModel = () => {
        setIsCommentModelOpen(true);
    };

    const handleCloseCommentModel = () => {
        setIsCommentModelOpen(false);
        setComment('');
    };

    const handleAddComment = () => {
        if (isTimerRunning) {
            setTimeLogs((prevLogs) =>
                prevLogs.map((log, index) =>
                    index === prevLogs.length -1 ? {...log, comment } : log
                )
            );
        } else {
            const currentTime = new Date();
            const date = `${String(currentTime.getDate()).padStart(2, '0')}-${currentTime.toLocaleString('default', { month: 'long'})}-${currentTime.getFullYear()}`;
            const day = currentTime.toLocaleDateString(undefined, {weekday: 'long'});
            setTimeLogs((prevLogs) => [...prevLogs, { date, day, login: '', sheets: [{name: '', link: ''}, {name: '', link: ''},{name: '', link: ''}], comment }]);
        }
        handleCloseCommentModel();    
    };

    const handleOpenLeaveModel = () => {
        setIsLeaveModelOpen(true);
    };

    const handleCloseLeaveModel = () => {
        setIsLeaveModelOpen(false);
        setLeaveReason('');
        setLeaveOption('today');
    };

    const handleMarkLeave = () => {
        setIsLeaveModelOpen(false);
        const currentTime = new Date();
        const date = `${String(currentTime.getDate()).padStart(2, '0')}-${currentTime.toLocaleString('default', { month: 'long'})}-${currentTime.getFullYear()}`;
        const day = currentTime.toLocaleDateString(undefined, {weekday: 'long'});
        const currentDate = new Date();
        const leaveDate = leaveOption === 'today' ? currentDate : { from: fromDate, to: toDate };
        const leaveReason = `LEAVE: ${leaveOption === 'today' ? 'Today Only' : `${fromDate.toLocaleDateString()} to ${toDate.toLocaleDateString()}`}`;

        setTimeLogs((prevLogs) => [
            ...prevLogs,
            {
                date: leaveDate.date,
                day: leaveDate.day,
                login: null,
                logout: null,
                sheet:[{name: '', link: ''}, {name: '', link: ''},{name: '', link: ''}],
                comment: leaveReason,
                isLeave: true,
            },
        ]);
        setLeaveReason('');
        setFromDate(null);
        setToDate(null);
    };

    const formatTime = (time) => {
        const hours = String(Math.floor(time / 3600)).padStart(2, '0');
        const minutes = String(Math.floor((time % 3600) / 60)).padStart(2, '0');
        const seconds = String(time % 60).padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    };

  return (
    <Box display='flex' flexDirection='column' alignItems='center' p={2}>
        <Box display='flex' width='100%' mb={2}>
            <Box flex={4} display='flex' flexDirection='column' alignItems='flex-start'>
                <Button variant='contained' color='warning' onClick={handleLoginClick} disabled={!isSheetFilled || isTimerRunning}>
                Login
                </Button>
                <Button variant='contained' color='secondary' onClick={handleLogoutClick} disabled={!isTimerRunning} style={{ marginTop: '10px'}}>
                    LOGOUT
                </Button>
                <Button variant='contained' color='info' onClick={handleOpenCommentModel} style={{ margin: '10px' }}>
                    Comments
                </Button>
                <Button variant='contained' color='primary' onClick={handleOpenLeaveModel} style={{ margin: '10px' }}>
                    LEAVE
                </Button>
            </Box>
            <Box flex={8} display='flex' flexDirection='column' alignItems='center'>
                <Grid container spacing={2}>
                    {sheets.map((sheet, index) => (
                        <React.Fragment key={index}>
                            <Grid item xs={6}>
                                <Box display='flex' alignItems='center'> 
                                    {index > 0 && (
                                        <IconButton onClick={() => handleAddSheet(index)} disabled={!isTimerRunning || (!sheets[index].name.trim() && !sheets[index].link.trim())} color='warning'>
                                            <AddIcon />
                                        </IconButton>
                                    )}
                                    <TextField 
                                        label={`Sheet Name ${index + 1}`}
                                        value={sheet.name}
                                        onChange={(e) => handleSheetChange(index, 'name', e.target.value)}
                                        fullWidth
                                        disabled={!isTimerRunning && index > 0}
                                    />
                                </Box>
                            </Grid>
                            <Grid item xs={6}>
                                <Box display='flex' alignItems='center'> 
                                        {index > 0 && (
                                            <IconButton onClick={() => handleAddSheet(index)} disabled={!isTimerRunning || (!sheets[index].name.trim() && !sheets[index].link.trim())} color='warning'>
                                                <AddIcon />
                                            </IconButton>
                                        )}
                                    <TextField 
                                        label={`Tab/Link ${index + 1}`}
                                        value={sheet.link}
                                        onChange={(e) => handleSheetChange(index, 'link', e.target.value)}
                                        fullWidth
                                        disabled={!isTimerRunning && index > 0}
                                    />
                                </Box>    
                            </Grid>
                        </React.Fragment>
                    ))}
                </Grid>
            </Box>
        </Box>
        <Typography variant='h4' mt={2}>
            {formatTime(elapsedTime)}
        </Typography>
        <Table mt={2} style={{ marginTop: '20px', width: '80%'}}>
            <TableHead>
                <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Day</TableCell>
                    <TableCell>Login Time</TableCell>
                    <TableCell>Logout Time</TableCell>
                    <TableCell>Sheet Name 1</TableCell>
                    <TableCell>Tab/Link 1</TableCell>
                    <TableCell>Sheet Name 2</TableCell>
                    <TableCell>Tab/Link 2</TableCell>
                    <TableCell>Sheet Name 3</TableCell>
                    <TableCell>Tab/Link 3</TableCell>
                    <TableCell>Comments</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {timeLogs.map((log, index) => (
                    <TableRow key={index}>
                        <TableCell>{log.date}</TableCell>
                        <TableCell>{log.day}</TableCell>
                        {log.isLeave ? (
                            <TableCell colSpan={8} align='center' style={{ fontWeight: 'bold', color: 'red' }}>{log.comment}</TableCell>
                        ) : (
                            <>
                                <TableCell>{log.login}</TableCell>
                                <TableCell>{log.logout}</TableCell>
                                {log.sheets.map((sheet, i) => (
                                    <React.Fragment key={i}>
                                        <TableCell>{sheet.name}</TableCell>
                                        <TableCell>{sheet.link}</TableCell>
                                    </React.Fragment>
                                ))}
                            </>
                        )}
                        <TableCell>{log.comment}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>

        <Modal open={isCommentModalOpen} onClose={handleCloseCommentModel}>
            <Box
                position='absolute'
                top='50%'
                left='50%'
                transform='translate(-50%, -50%)'
                bgcolor='background.paper'
                border='2px sloid #000'
                boxShadow={24}
                p={4}
                width={400}
            >
                <Typography variant='h6' mb={2}>Add Comment</Typography>
                <TextareaAutosize
                    minRows={4}
                    style={{ width: '100%' }}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />
                <Box display='flex' justifyContent='flex-end' mt={2}>
                    <Button variant='contained' color='primary' onClick={handleAddComment}>
                        Add
                    </Button>
                </Box>
            </Box>
        </Modal>

        <Modal open={isLeaveModelOpen} onClose={handleCloseLeaveModel}>
            <Box
                position='absolute'
                top='50%'
                left='50%'
                transform='translate(-50%, -50%)'
                bgcolor='background.paper'
                border='2px sloid #000'
                boxShadow={24}
                p={4}
                width={400}
            >
                <Typography variant='h6' mb={2}>Mark Leave</Typography>
                <FormControl component='fieldset'>
                    <FormLabel component='legend'>Leave Option</FormLabel>
                    <RadioGroup
                    aria-label='leave-option'
                    name='leave-option'
                    value={leaveOption}
                    onChange={(e) => setLeaveOption(e.target.value)}
                >
                    <FormControlLabel value='today' control={<Radio />} label='Today Only' />
                    <FormControlLabel value='dataWise' control={<Radio />} label='Date Wise' />
                </RadioGroup>
                </FormControl>
                {leaveOption === 'dateWise' && (
                    <>
                        <DatePicker
                            label='From Date'
                            value={fromDate}
                            onChange={(date) => setFromDate(date)}
                            fullWidth
                            style={{ marginBottom: '10px'}}
                        />
                        <DatePicker
                            label='To Date'
                            value={toDate}
                            onChange={(date) => setToDate(date)}
                            fullWidth
                            style={{ marginBottom: '10px'}}
                        />
                    </>
                )}
                <TextareaAutosize 
                    minRows={4}
                    style={{ width: '100%', marginTop: '10px' }}
                    placeholder='Reason of Leave'
                    value={leaveReason}
                    onChange={(e) => setLeaveReason(e.target.value)}
                    required
                />
                <Box display='flex' justifyContent='flex-end' mt={2}>
                    <Button variant='conatined' color='primary' onClick={handleMarkLeave} disabled={!leaveReason.trim()}>
                        Mark Leave
                    </Button>
                </Box>
            </Box>
        </Modal>
    </Box>
  );
};

export default TimeTracking