import { useReducer } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { gameReducer, makeInitialState } from './game/reducer';
import { AuthGate } from './components/AuthGate';
import { HomeScreen } from './screens/HomeScreen';
import { SetupScreen } from './screens/SetupScreen';
import { GameScreen } from './screens/GameScreen';
import { StatsScreen } from './screens/StatsScreen';
import { CategoriesScreen } from './screens/CategoriesScreen';

function App() {
  const { user, signInWithGoogle, signInAnonymously } = useAuth();
  const [gameState, dispatch] = useReducer(gameReducer, undefined, makeInitialState);

  return (
    <AuthGate user={user} onGoogle={signInWithGoogle} onAnon={signInAnonymously}>
      {user && (
        <Routes>
          <Route path="/" element={<HomeScreen user={user} />} />
          <Route
            path="/setup"
            element={<SetupScreen state={gameState} dispatch={dispatch} user={user} />}
          />
          <Route
            path="/game"
            element={<GameScreen state={gameState} dispatch={dispatch} user={user} />}
          />
          <Route path="/stats" element={<StatsScreen user={user} />} />
          <Route path="/categories" element={<CategoriesScreen user={user} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      )}
    </AuthGate>
  );
}

export default App;
