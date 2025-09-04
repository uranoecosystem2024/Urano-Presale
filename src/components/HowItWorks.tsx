"use client"

import { Stack, Typography, Box, Link } from "@mui/material"
import { useTheme, type Theme } from "@mui/material/styles"
import Image from "next/image"
import { motion, useAnimation } from "framer-motion"
import { useEffect, useState } from "react"

import Union from "@/assets/images/Union.png"
import img1 from "@/assets/images/img1.webp"
import coins from "@/assets/images/coins.webp"

const HowItWorks = () => {
  const theme = useTheme<Theme>()
  const [isInView, setIsInView] = useState(false)

  const lineControls = useAnimation()
  const imageControls = useAnimation()

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsInView(true)
        }
      },
      { threshold: 0.5 }
    )

    const el = document.getElementById("howItWorksSection")
    if (el) observer.observe(el)

    return () => {
      if (el) observer.unobserve(el)
    }
  }, [])

  useEffect(() => {
  if (isInView) {
    void lineControls
      .start({
        width: "calc(66% + 4rem)",
        transition: { duration: 1, ease: "easeOut" },
      })
      .catch((error) => {
        console.error("Error in lineControls animation:", error);
      });

    setTimeout(() => {
      void imageControls
        .start({
          scale: 1.1,
          transition: {
            duration: 0.3,
            ease: "easeOut",
          },
        })
        .then(() => {
          void imageControls.start({
            scale: 1,
            transition: { duration: 0.3, ease: "easeOut" },
          });
        })
        .catch((error) => {
          console.error("Error in imageControls animation:", error);
        });
    }, 1000);
  }
}, [isInView, lineControls, imageControls]);


  return (
    <Stack
      id="howItWorksSection"
      height={"50%"}
      width={"100%"}
      display={{ xs: "none", lg: "block" }}
      sx={{
        borderRadius: 2,
        position: "relative",
        paddingY: { xs: 2, lg: 0 },
        backgroundColor: { xs: theme.palette.transparentPaper.main, lg: "transparent" },
        border: { xs: `1px solid ${theme.palette.headerBorder.main}`, lg: "none" },
      }}
    >
      <Image
        className="howItWorksUnion"
        src={Union}
        alt="Union"
        fill
        style={{ position: "absolute", top: 0, left: 0, zIndex: 1 }}
      />
      <Typography
        variant="h5"
        sx={{
          background: theme.palette.uranoGradient,
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          fontWeight: 500,
          fontSize: 22,
          position: "absolute",
          top: 0,
          left: 0,
          marginTop: "1%",
          marginLeft: "3.75%",
          zIndex: 2,
          display: { xs: "none", lg: "block" },
        }}
      >
        How it works
      </Typography>
      <Typography
        variant="h5"
        sx={{
          background: theme.palette.uranoGradient,
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          fontWeight: 500,
          fontSize: 22,
          display: { xs: "block", lg: "none" },
          marginBottom: 1,
          paddingX: 2,
        }}
      >
        How it works
      </Typography>

      <Stack
        width={"100%"}
        height={"100%"}
        sx={{
          minHeight: 220,
          width: "100%",
          display: "flex",
          flexDirection: { xs: "column", lg: "row" },
          justifyContent: "space-between",
          alignItems: "center",
          paddingX: { xs: 0, lg: 5 },
          paddingTop: { xs: 2, lg: 6 },
          paddingBottom: 2,
          gap: { xs: 2, lg: 4 },
          position: "relative",
          zIndex: 2,
        }}
      >
        <Box
          id="howItWorksMobileLine"
          sx={{
            height: "60%",
            width: 5,
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 5,
            marginTop: 1,
            display: { xs: "block", lg: "none" },
          }}
        >
          <Box
            sx={{
              width: "calc(66% + 8rem)",
              height: "100%",
              borderLeft: `3px solid ${theme.palette.uranoGreen1.main}`,
            }}
          />
        </Box>

        <Stack paddingX={2} width={{ xs: "100%", lg: "22%" }} gap={1}>
          <Typography variant="subtitle1" color={"#fff"} sx={{ fontWeight: 500, fontSize: 16 }}>
            Tokenize
          </Typography>
          <Typography
            variant="body2"
            sx={{ fontWeight: 400, fontSize: 14, color: theme.palette.text.secondary }}
          >
            Real-world assets are digitized into secure, compliant tokens.
          </Typography>
        </Stack>

        <Stack paddingX={2} width={{ xs: "100%", lg: "22%" }} gap={1}>
          <Typography variant="subtitle1" sx={{ fontWeight: 500, fontSize: 16 }}>
            Invest
          </Typography>
          <Typography
            variant="body2"
            sx={{ fontWeight: 400, fontSize: 14, color: theme.palette.text.secondary }}
          >
            Access fractional ownership with low entry barriers
          </Typography>
        </Stack>

        <Stack paddingX={2} width={{ xs: "100%", lg: "22%" }} gap={1}>
          <Typography variant="subtitle1" sx={{ fontWeight: 500, fontSize: 16 }}>
            Earn / Settle
          </Typography>
          <Typography
            variant="body2"
            sx={{ fontWeight: 400, fontSize: 14, color: theme.palette.text.secondary }}
          >
            Receive returns and settlements instantly via blockchain.
          </Typography>
        </Stack>

        <Stack
          paddingX={2}
          width={{ xs: "100%", lg: "22%" }}
          alignItems={"center"}
          justifyContent={"end"}
          marginTop={-2}
        >
          <motion.div
            animate={imageControls}
            className="howItWorksImgDesktop"
            style={{ display: "inline-block" }}
          >
            <Image className="howItWorksImgDesktop" src={img1} alt="img1" width={220} height={150} />
          </motion.div>
          <Image className="howItWorksImgMobile" src={img1} alt="img1" width={190} height={150} />
          <Link href="https://docs.uranoecosystem.com/the-legal-and-compliant-structure-of-urano" target="_blank" underline="none" sx={{ width: { xs: "95%", lg: "fit-content" } }}>
            <Box
              sx={{
                width: { xs: "100%", lg: "fit-content" },
                marginTop: -4,
                background: { xs: theme.palette.uranoGreen1.main, lg: theme.palette.secondary.main },
                border: `1px solid ${theme.palette.headerBorder.main}`,
                borderRadius: 2,
                boxShadow: 2,
                paddingX: 3,
                paddingY: 1,
                marginLeft: 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                "&:hover": {
                  background: theme.palette.uranoGradient,
                  "&:hover .connectWalletLink": {
                    color: theme.palette.info.main,
                  },
                },
              }}
            >
              <Typography
                variant="body1"
                fontWeight={400}
                color={theme.palette.text.disabled}
                className="connectWalletLink"
              >
                Compliance Note
              </Typography>
            </Box>
          </Link>
        </Stack>
      </Stack>

      {/* Line Animation */}
      <motion.div
        id="howItWorksDesktopLine"
        animate={lineControls}
        initial={{ width: 0 }}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          zIndex: 5,
          height: "5px",
          padding: "0 0 0 2.5rem",
          width: 0,
        }}
      >
        <Box
          sx={{
            height: "100%",
            borderBottom: `3px solid ${theme.palette.uranoGreen1.main}`,
          }}
        />
      </motion.div>
    </Stack>
  )
}

export default HowItWorks
