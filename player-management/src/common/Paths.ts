export default {
  Base: '/api',
  Players: {
    Base: '/players',
    Get: '/:playerId',
    Add: '',
    Update: '/:playerId',
    Delete: '/:playerId',
  },
} as const;
