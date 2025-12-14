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
    image: 'https://community.skin.club/wp-content/uploads/2025/09/cs2.jpg.webp',
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
    image: 'https://stoneforest.ru/wp-content/uploads/2024/03/dota-2-istorija-1.jpg',
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
    image: 'https://i.guim.co.uk/img/media/d5eab25b9cd2a38580bf8a13e7756b2eb27e6a5d/79_167_1047_628/master/1047.jpg?width=1200&quality=85&auto=format&fit=max&s=5f707d27cfeb0f6b39090e8db40c3144',
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
    image: 'https://img.asmedia.epimg.net/resizer/v2/VZCOELXOSZEGTNIOQBV4C7UX2Q.jpg?auth=ed45f3fab93199d7dcc1e900831c4008a57d584ac0d9c0a3a05ee8d2e1224052&width=1472&height=828&smart=true',
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
    image: 'https://cdn2.unrealengine.com/fortnite-cyber-city-callout-1920x1080-438b539f6ead.jpg',
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
    image: 'https://cdn.playersupport.riotgames.com/support-site/images/lol/masthead/background.webp',
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
