import {
  ActionIcon,
  Image,
  Group,
  Text,
  Box,
} from "@mantine/core";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from 'lucide-react'

const CrashReportImageCarousel = ({
  id,
  report,
  imageSrc,
  height
}) => {
  const images = [...(report?.body?.image_bins || [])].slice(1);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Create array of all images including the main imageSrc
  const allImages = [
    { src: `data:image/png;base64,${imageSrc}`, isMain: true },
    ...images.map(img => ({ src: `data:image/png;base64,${img}`, isMain: false }))
  ];

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? allImages.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === allImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  if (allImages.length === 0) {
    return null;
  }

  return (
    <TransformWrapper>
      <Box pos="relative">
        <TransformComponent
          contentStyle={{
            height: `calc(100vh - ${height + 95}px)`,
            width: '100%'
          }}
        >
          <Image
            style={{
              viewTransitionName: currentIndex === 0 ? `report-cover-photo-${id}` : undefined
            }}
            h={"100%"}
            w="100%"
            fit="contain"
            src={allImages[currentIndex].src}
          />
        </TransformComponent>

        {/* Navigation arrows - only show if more than 1 image */}
        {allImages.length > 1 && (
          <>
            <ActionIcon
              onClick={goToPrevious}
              pos="absolute"
              left={16}
              top="50%"
              style={{ transform: 'translateY(-50%)', zIndex: 10 }}
              size="lg"
              radius="xl"
              variant="filled"
              color="dark"
              opacity={0.7}
              aria-label="Previous image"
            >
              <ChevronLeft />
            </ActionIcon>

            <ActionIcon
              onClick={goToNext}
              pos="absolute"
              right={16}
              top="50%"
              style={{ transform: 'translateY(-50%)', zIndex: 10 }}
              size="lg"
              radius="xl"
              variant="filled"
              color="dark"
              opacity={0.7}
              aria-label="Next image"
            >
              <ChevronRight />
            </ActionIcon>
          </>
        )}

        {/* Dots indicator - only show if more than 1 image */}
        {allImages.length > 1 && (
          <Group
            pos="absolute"
            bottom={16}
            left="50%"
            style={{ transform: 'translateX(-50%)', zIndex: 10 }}
            gap="xs"
          >
            {allImages.map((_, index) => (
              <ActionIcon
                key={index}
                onClick={() => goToSlide(index)}
                size={8}
                radius="xl"
                variant={index === currentIndex ? "filled" : "outline"}
                color="gray"
                style={{
                  backgroundColor: index === currentIndex ? 'white' : 'rgba(255, 255, 255, 0.5)',
                  borderColor: 'white'
                }}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </Group>
        )}

        {/* Image counter */}
        {allImages.length > 1 && (
          <Box
            pos="absolute"
            top={16}
            right={16}
            bg="dark"
            c="white"
            px="sm"
            py="xs"
            style={{ zIndex: 10, borderRadius: '999px', opacity: 0.8 }}
          >
            <Text size="sm" fw={500}>
              {currentIndex + 1} / {allImages.length}
            </Text>
          </Box>
        )}
      </Box>
    </TransformWrapper>
  );
};

export default CrashReportImageCarousel
