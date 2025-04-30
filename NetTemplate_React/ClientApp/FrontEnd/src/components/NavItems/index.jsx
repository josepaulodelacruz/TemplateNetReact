import {
  Group,
  Text,
  Collapse,
  Box,
  AccordionChevron,
  Center,
  useMantineTheme,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import './index.css';
import { ChevronRight } from 'lucide-react';

const NavItems = ({
  leftIcon = null,
  label = "",
  children = null
}) => {
  const [opened, { toggle }] = useDisclosure(false);

  return (
    <Box >
      <Group className='nav-item-container' py={5} align='center' justify='space-between' onClick={toggle}>
        <Group align='center' justify='center'>
          <Box className='nav-item-icon-container' p={3} >
            <Center>
              {leftIcon}
            </Center>
          </Box>
          <Text>
            {label}
          </Text>
        </Group>
        {
          children && (
            <ChevronRight size={16} />
          )
        }
      </Group>
      <Collapse className='nav-collapsible-items-container' in={opened}>
        {children}
      </Collapse>
    </Box>
  )
}

export {
  NavItems,
}



