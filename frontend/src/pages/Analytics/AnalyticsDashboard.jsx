import { Box, Typography } from '@mui/material';
import StatisticsCards from './StatisticsCards';
import TopSkillsChart from './TopSkillsChart';
import DomainDistributionChart from './DomainDistributionChart';
import LocationAnalytics from './LocationAnalytics';
import ExperienceAnalytics from './ExperienceAnalytics';

const AnalyticsDashboard = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box>
        <Typography variant="h5" fontWeight={700}>
          Analytics Dashboard
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Comprehensive insights into your workforce
        </Typography>
      </Box>

      <StatisticsCards />

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 3 }}>
        <TopSkillsChart />
        <DomainDistributionChart />
      </Box>

      <ExperienceAnalytics />

      <LocationAnalytics />
    </Box>
  );
};

export default AnalyticsDashboard;
