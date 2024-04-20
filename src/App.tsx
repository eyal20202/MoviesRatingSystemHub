// App.tsx
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import MovieGrid from './components/MovieGrid';
import Graph from './components/Graph';
import { loginApi, getMoviesApi } from './components/api';
import { Movie, VoteData } from './types';
import * as signalR from '@microsoft/signalr';
import { Container, Grid  } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useTheme } from '@mui/material/styles';
const useStyles = makeStyles((theme: any) => ({
  root: {
    flexGrow: 1,
    paddingTop: useTheme().spacing(4),
  },
}));
const App: React.FC = () => {
  const classes = useStyles();
  const [connectionStatus, setConnectionStatus] = useState<boolean>(false);
  const [lastDataTime, setLastDataTime] = useState<string>('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [voteData, setVoteData] = useState<VoteData[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await loginApi();
        const hubConnection = new signalR.HubConnectionBuilder()
          .withUrl('http://62.90.222.249:10001/ClientHub', {
            accessTokenFactory: () => token.token,
            withCredentials: false ,
          })
          .configureLogging(signalR.LogLevel.Information)
          .build();
          
        hubConnection.on('DataReceived', (data: VoteData[]) => {
          setVoteData((prevData) => [...prevData, ...data]);
          setLastDataTime(new Date().toLocaleString());
        });

        await hubConnection.start();
        setConnectionStatus(true);

        const moviesData = await getMoviesApi(token.token);
        setMovies(moviesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleMovieSelect = (movie: Movie) => {
    setSelectedMovie(movie);
  };
  return (
    <div className={classes.root}>
      <Container maxWidth="lg">
        <Header connectionStatus={connectionStatus} lastDataTime={lastDataTime} />
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <MovieGrid
              movies={movies}
              onMovieSelect={handleMovieSelect}
              voteData={voteData}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Graph selectedMovie={selectedMovie} voteData={voteData} />
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default App;
