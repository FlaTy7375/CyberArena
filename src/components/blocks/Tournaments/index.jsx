import { Users, Clock } from 'lucide-react';
import {
  TournamentsWrapper,
  TournamentsContainer,
  TournamentsHeader,
  TournamentsLabel,
  TournamentsTitle,
  TournamentsSubtitle,
  TournamentsGrid,
  TournamentCard,
  TournamentImage,
  TournamentDate,
  DateDay,
  DateMonth,
  TournamentStatus,
  TournamentContent,
  TournamentGame,
  TournamentName,
  TournamentMeta,
  MetaItem,
  TournamentPrize,
  PrizeLabel,
  PrizeValue,
} from './style';

const tournaments = [
  {
    id: 1,
    game: 'Counter-Strike 2',
    name: 'CS2 Winter Cup',
    day: '21',
    month: 'Дек',
    time: '18:00',
    players: '5v5',
    prize: '50 000₽',
    status: 'open',
    statusLabel: 'Открыта',
    image: '/images/gallery-08.webp',
  },
  {
    id: 2,
    game: 'Dota 2',
    name: 'Dota 2 Championship',
    day: '28',
    month: 'Дек',
    time: '16:00',
    players: '5v5',
    prize: '75 000₽',
    status: 'open',
    statusLabel: 'Открыта',
    image: '/images/gallery-09.jpg',
  },
  {
    id: 3,
    game: 'Valorant',
    name: 'Valorant New Year',
    day: '05',
    month: 'Янв',
    time: '14:00',
    players: '5v5',
    prize: '40 000₽',
    status: 'soon',
    statusLabel: 'Скоро',
    image: '/images/gallery-10.webp',
  },
  {
    id: 4,
    game: 'FIFA 24',
    name: 'FIFA Ultimate',
    day: '15',
    month: 'Янв',
    time: '17:00',
    players: '1v1',
    prize: '20 000₽',
    status: 'soon',
    statusLabel: 'Скоро',
    image: '/images/gallery-11.avif',
  },
  {
    id: 5,
    game: 'Fortnite',
    name: 'Battle Royale',
    day: '20',
    month: 'Янв',
    time: '15:00',
    players: 'Solo',
    prize: '30 000₽',
    status: 'soon',
    statusLabel: 'Скоро',
    image: '/images/gallery-12.jpg',
  },
  {
    id: 6,
    game: 'League of Legends',
    name: 'LoL Grand Prix',
    day: '01',
    month: 'Фев',
    time: '13:00',
    players: '5v5',
    prize: '100 000₽',
    status: 'soon',
    statusLabel: 'Скоро',
    image: '/images/gallery-13.webp',
  },
];

const Tournaments = () => {
  return (
    <TournamentsWrapper id="tournaments" data-testid="section-tournaments">
      <TournamentsContainer>
        <TournamentsHeader>
          <TournamentsLabel>Соревнования</TournamentsLabel>
          <TournamentsTitle data-testid="tournaments-title">
            Турниры и <span>события</span>
          </TournamentsTitle>
          <TournamentsSubtitle>
            Участвуйте в еженедельных турнирах, выигрывайте призы и станьте частью киберспортивного сообщества
          </TournamentsSubtitle>
        </TournamentsHeader>

        <TournamentsGrid>
          {tournaments.map((tournament) => (
            <TournamentCard key={tournament.id} data-testid={`tournament-card-${tournament.id}`}>
              <TournamentImage>
                <img src={tournament.image} alt={tournament.name} />
                <TournamentDate>
                  <DateDay>{tournament.day}</DateDay>
                  <DateMonth>{tournament.month}</DateMonth>
                </TournamentDate>
                <TournamentStatus $status={tournament.status}>
                  {tournament.statusLabel}
                </TournamentStatus>
              </TournamentImage>
              
              <TournamentContent>
                <TournamentGame>{tournament.game}</TournamentGame>
                <TournamentName>{tournament.name}</TournamentName>
                
                <TournamentMeta>
                  <MetaItem>
                    <Clock />
                    {tournament.time}
                  </MetaItem>
                  <MetaItem>
                    <Users />
                    {tournament.players}
                  </MetaItem>
                </TournamentMeta>

                <TournamentPrize>
                  <PrizeLabel>Призовой фонд</PrizeLabel>
                  <PrizeValue>{tournament.prize}</PrizeValue>
                </TournamentPrize>
              </TournamentContent>
            </TournamentCard>
          ))}
        </TournamentsGrid>
      </TournamentsContainer>
    </TournamentsWrapper>
  );
};

export default Tournaments;
