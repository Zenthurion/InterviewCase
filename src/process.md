# Case

## Data

-   Ekstern data fra vegvesenet
-   Data om rasteplass og parkeringsstørrelse
-   "lokal" lagring av samlet data der data fra begge kildene kan oppdateres uavhengig

## API Prosess

1. Koble til database
2. Lytt til API queries
3. Les av alle query-parametere
4. Konstruer et query som passer datastrukturen basert på alle gyldige parametere
5. Returner resultatet
