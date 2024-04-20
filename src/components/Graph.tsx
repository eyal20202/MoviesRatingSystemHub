import React, { useRef, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Movie, VoteData } from '../types';
import { ChartOptions, ChartData,Chart as ChartJS,registerables  } from 'chart.js';
import 'chartjs-adapter-moment';
import { Typography, Box } from '@mui/material';
import { makeStyles } from '@mui/styles';
interface GraphProps {
  selectedMovie: Movie | null;
  voteData: VoteData[];
}

const useStyles = makeStyles({
  title: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
  },
});
const Graph: React.FC<GraphProps> = ({ selectedMovie, voteData }) => {
    const classes = useStyles();
    const chartRef = useRef<ChartJS<'line', { x: Date; y: number }[], unknown> | null>(null);
    useEffect(()=>{
        ChartJS.register(
           ...registerables
          )
    },[])
  useEffect(() => {
    if (chartRef?.current) {
    //   chartRef.current.destroy();
    }
  }, [selectedMovie]);
  const movieVoteData = selectedMovie
    ? voteData
        .filter((vote) => vote.itemId === selectedMovie.id)
        .slice(-20)
        .map((vote) => ({
          x: new Date(vote.generatedTime),
          y: vote.itemCount,
        }))
    : [];

  const data: ChartData<'line', { x: Date; y: number }[]> = {
    datasets: [
      {
        label: selectedMovie?.description,
        data: movieVoteData,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'day',
        },
        title: {
          display: true,
          text: 'Time',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Votes',
        },
      },
    },
  };

  return (
    <Box>
      {selectedMovie ? (
        <Box textAlign="center">
          <Typography gutterBottom align="center" variant="h4" className={classes.title}>
            Votes for {selectedMovie.description}
          </Typography>
          <Line data={data} options={options} ref={chartRef} />
        </Box>
      ) : (
        <Typography gutterBottom align="center" variant="h4" className={classes.title}>
          Select a movie to view the graph
        </Typography>
      )}
    </Box>
  );
};

export default Graph;