import React, { useState, useMemo, useEffect } from 'react';
import { Movie, VoteData } from '../types';
import { Grid, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { ArrowUpward, ArrowDownward } from '@mui/icons-material';
interface MovieGridProps {
    movies: Movie[];
    onMovieSelect: (movie: Movie) => void;
    voteData: VoteData[];
}

const MovieGrid: React.FC<MovieGridProps> = ({
    movies,
    onMovieSelect,
    voteData,
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortColumn, setSortColumn] = useState<
        'id' | 'description' | 'totalVotes' | 'lastUpdatedTime' | 'positionChange' | null
    >(null);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    useEffect(() => {
        return () => {
            const m = [...movies].sort((a, b) => getTotalVotes(b.id) - getTotalVotes(a.id))
            return sessionStorage.setItem('prevMovieList', JSON.stringify(m));
        }
    }, [movies, voteData]);
    const getTotalVotes = (movieId: number) => {
        const movieVotes = voteData.filter((vote) => vote.itemId === movieId);
        return movieVotes.reduce((total, vote) => total + vote.itemCount, 0);
    };

    const getLastUpdatedTime = (movieId: number) => {
        const movieVotes = voteData.filter((vote) => vote.itemId === movieId);
        if (movieVotes.length === 0) return '';

        const lastVote = movieVotes[movieVotes.length - 1];
        return new Date(lastVote.generatedTime).toLocaleString();
    };

    const getPositionChange = useMemo(() => {
        const prevMovieList: Movie[] = JSON.parse(sessionStorage.getItem('prevMovieList') || '[]');
        const currentMovieList = [...movies].sort((a, b) => getTotalVotes(b.id) - getTotalVotes(a.id));
        return (movieId: number) => {

            const prevMovie = prevMovieList.find((movie) => movie.id === movieId);

            if (!prevMovie) return '=';

            const currentPosition = currentMovieList.findIndex((movie) => movie.id === movieId) + 1;
            const prevPosition = prevMovieList.findIndex((movie) => movie.id === movieId) + 1;
            if (currentPosition < prevPosition) {
                return '↑';
            } else if (currentPosition > prevPosition) {
                return '↓';
            } else {
                return '=';
            }
        };
    }, [getTotalVotes, voteData]);

    const filteredMovies = movies.filter((movie) =>
        movie.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const getPositionChangeColor = (positionChange: string): string => {
        if (positionChange === '↑') {
            return 'green'; // Color for up arrow
        } else if (positionChange === '↓') {
            return 'red'; // Color for down arrow
        } else {
            return ''; // Default color
        }
    };
    const renderSortIcon = (column: 'id' | 'description' | 'totalVotes' | 'lastUpdatedTime' | 'positionChange') => {
        if (sortColumn === column) {
            return sortDirection === 'asc' ? <ArrowUpward /> : <ArrowDownward />;
        } else {
            return null;
        }
    };
    const sortedMovies = useMemo(() => {
        const sortedMovies = [...filteredMovies];

        if (sortColumn) {
            sortedMovies.sort((a, b) => {
                let aValue, bValue;

                switch (sortColumn) {
                    case 'id':
                        aValue = a.id;
                        bValue = b.id;
                        break;
                    case 'description':
                        aValue = a.description.toLowerCase();
                        bValue = b.description.toLowerCase();
                        break;
                    case 'totalVotes':
                        aValue = getTotalVotes(a.id);
                        bValue = getTotalVotes(b.id);
                        break;
                    case 'lastUpdatedTime':
                        aValue = getLastUpdatedTime(a.id);
                        bValue = getLastUpdatedTime(b.id);
                        break;
                    case 'positionChange':
                        aValue = getPositionChange(a.id);
                        bValue = getPositionChange(b.id);
                        break;
                    default:
                        aValue = null;
                        bValue = null;
                }

                if (aValue === null && bValue === null) return 0;
                if (aValue === null) return sortDirection === 'asc' ? 1 : -1;
                if (bValue === null) return sortDirection === 'asc' ? -1 : 1;
                if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
                if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
                return 0;
            });
        }

        return sortedMovies;
    }, [sortColumn, sortDirection, filteredMovies, getTotalVotes, getLastUpdatedTime, getPositionChange]);

    const handleSort = (column: 'id' | 'description' | 'totalVotes' | 'lastUpdatedTime' | 'positionChange') => {
        if (sortColumn === column) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(column);
            setSortDirection('asc');
        }
    };

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
            <TextField
                type="text"
                placeholder="Search movies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton>
                                <SearchIcon />
                            </IconButton>
                        </InputAdornment>
                    )
                }}
            />
            </Grid>
            <Grid item xs={12}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow style={{backgroundColor: '#f0f0f0'}}>
                                <TableCell onClick={() => handleSort('id')}>Movie ID  {renderSortIcon('id')}</TableCell>
                                <TableCell onClick={() => handleSort('description')}>Movie Description  {renderSortIcon('description')}</TableCell>
                                <TableCell onClick={() => handleSort('totalVotes')}>Total Votes  {renderSortIcon('totalVotes')}</TableCell>
                                <TableCell onClick={() => handleSort('lastUpdatedTime')}>Last Updated Time  {renderSortIcon('lastUpdatedTime')}</TableCell>
                                <TableCell onClick={() => handleSort('positionChange')}>Position Change  {renderSortIcon('positionChange')}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {sortedMovies.map((movie) => (
                                <TableRow key={movie.id} onClick={() => onMovieSelect(movie)}>
                                    <TableCell>{movie.id}</TableCell>
                                    <TableCell>{movie.description}</TableCell>
                                    <TableCell>{getTotalVotes(movie.id)}</TableCell>
                                    <TableCell>{getLastUpdatedTime(movie.id)}</TableCell>
                                    <TableCell style={{ color: getPositionChangeColor(getPositionChange(movie.id)) }}>{getPositionChange(movie.id)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
        </Grid>
    );
};

export default MovieGrid;